import { supabase, KnowledgeBaseEntry } from '../lib/supabase';

export const searchKnowledgeBase = async (question: string): Promise<string | null> => {
  const normalizedQuestion = question.toLowerCase().trim();

  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .ilike('question', `%${normalizedQuestion}%`)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error searching knowledge base:', error);
    return null;
  }

  if (data && data.length > 0) {
    return data[0].answer;
  }

  return null;
};

export const getAllKnowledgeBaseEntries = async (): Promise<KnowledgeBaseEntry[]> => {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching knowledge base:', error);
    return [];
  }

  return data || [];
};

export const updateKnowledgeBaseEntry = async (
  id: string,
  question: string,
  answer: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('knowledge_base')
    .update({
      question,
      answer,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating knowledge base entry:', error);
    return false;
  }

  return true;
};

export const deleteKnowledgeBaseEntry = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('knowledge_base')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting knowledge base entry:', error);
    return false;
  }

  return true;
};
