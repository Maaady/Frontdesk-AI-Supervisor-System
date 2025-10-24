import { supabase, HelpRequest } from '../lib/supabase';

export const createHelpRequest = async (
  callerName: string,
  callerPhone: string,
  question: string
): Promise<HelpRequest | null> => {
  const { data, error } = await supabase
    .from('help_requests')
    .insert({
      caller_name: callerName,
      caller_phone: callerPhone,
      question: question,
      status: 'pending',
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating help request:', error);
    return null;
  }

  console.log(`[ESCALATION] Request created for ${callerName} (${callerPhone})`);
  console.log(`[ESCALATION] Question: "${question}"`);
  console.log(`[SUPERVISOR NOTIFICATION] Hey, I need help answering: "${question}"`);

  return data;
};

export const getPendingRequests = async (): Promise<HelpRequest[]> => {
  const { data, error } = await supabase
    .from('help_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending requests:', error);
    return [];
  }

  return data || [];
};

export const getAllRequests = async (): Promise<HelpRequest[]> => {
  const { data, error } = await supabase
    .from('help_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all requests:', error);
    return [];
  }

  return data || [];
};

export const respondToRequest = async (
  requestId: string,
  response: string
): Promise<boolean> => {
  const { data: request, error: fetchError } = await supabase
    .from('help_requests')
    .select('*')
    .eq('id', requestId)
    .maybeSingle();

  if (fetchError || !request) {
    console.error('Error fetching request:', fetchError);
    return false;
  }

  const { error: updateError } = await supabase
    .from('help_requests')
    .update({
      supervisor_response: response,
      status: 'resolved',
      responded_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (updateError) {
    console.error('Error updating request:', updateError);
    return false;
  }

  console.log(`[CALLBACK] Texting ${request.caller_name} at ${request.caller_phone}`);
  console.log(`[CALLBACK] Message: "Hi ${request.caller_name}, regarding your question: '${request.question}' - ${response}"`);

  await addToKnowledgeBase(request.question, response, requestId);

  return true;
};

export const markRequestUnresolved = async (requestId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('help_requests')
    .update({
      status: 'unresolved',
    })
    .eq('id', requestId);

  if (error) {
    console.error('Error marking request as unresolved:', error);
    return false;
  }

  return true;
};

export const checkExpiredRequests = async (): Promise<void> => {
  const { data: expiredRequests, error } = await supabase
    .from('help_requests')
    .select('*')
    .eq('status', 'pending')
    .lt('expires_at', new Date().toISOString());

  if (error) {
    console.error('Error checking expired requests:', error);
    return;
  }

  if (expiredRequests && expiredRequests.length > 0) {
    for (const request of expiredRequests) {
      await markRequestUnresolved(request.id);
      console.log(`[TIMEOUT] Request ${request.id} marked as unresolved after timeout`);
    }
  }
};

const addToKnowledgeBase = async (
  question: string,
  answer: string,
  sourceRequestId: string
): Promise<void> => {
  const { error } = await supabase
    .from('knowledge_base')
    .insert({
      question: question,
      answer: answer,
      source_request_id: sourceRequestId,
    });

  if (error) {
    console.error('Error adding to knowledge base:', error);
    return;
  }

  console.log(`[KNOWLEDGE BASE] Learned new answer for: "${question}"`);
};
