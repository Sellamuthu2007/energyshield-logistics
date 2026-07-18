import { supabase } from '@/lib/supabaseClient';
import type {
  NationalRiskScore,
  SupplierCountry,
  AIRiskInsight,
  GovernmentAlert,
  StrategicPetroleumReserve,
  GovernmentRecommendation
} from '@/types/government';
import { createNotification } from './notificationService';

export async function getNationalRiskScore(): Promise<NationalRiskScore> {
  const { data, error } = await supabase
    .from('national_risk_score')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching national risk score:', error);
    throw error;
  }
  return data as NationalRiskScore;
}

export async function getSupplierCountries(): Promise<SupplierCountry[]> {
  const { data, error } = await supabase
    .from('supplier_countries')
    .select('*');

  if (error) {
    console.error('Error fetching supplier countries:', error);
    throw error;
  }
  
  // Map latitude/longitude to the coordinates array expected by the map UI
  return (data || []).map((country: any) => ({
    ...country,
    coordinates: [country.latitude, country.longitude]
  })) as SupplierCountry[];
}

export async function getAIRiskInsights(): Promise<AIRiskInsight[]> {
  const { data, error } = await supabase
    .from('ai_risk_insights')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching AI risk insights:', error);
    throw error;
  }
  return data as AIRiskInsight[];
}

export async function getGovernmentAlerts(): Promise<GovernmentAlert[]> {
  const { data, error } = await supabase
    .from('government_alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching government alerts:', error);
    throw error;
  }
  return data as GovernmentAlert[];
}

export async function getStrategicPetroleumReserve(): Promise<StrategicPetroleumReserve> {
  const { data, error } = await supabase
    .from('strategic_petroleum_reserve')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching SPR data:', error);
    throw error;
  }
  return data as StrategicPetroleumReserve;
}

export async function getGovernmentRecommendations(): Promise<GovernmentRecommendation[]> {
  const { data, error } = await supabase
    .from('government_recommendations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
  return data as GovernmentRecommendation[];
}

export async function approveAndForwardRecommendation(id: string, userId: string): Promise<void> {
  const { error, data } = await supabase
    .from('government_recommendations')
    .update({ status: 'forwarded', approved_by: userId })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('DB update failed for recommendation approval:', error);
    throw error;
  }

  // After approving, create a notification for procurement
  if (data) {
    await createNotification(
      'procurement',
      'New Government Recommendation Forwarded',
      `A recommendation for "${data.title}" has been approved by the Government and forwarded to Procurement.`
    );
  }
}
