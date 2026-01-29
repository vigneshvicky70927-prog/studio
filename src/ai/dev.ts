import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-ac-capacity.ts';
import '@/ai/flows/provide-efficiency-suggestions.ts';
import '@/ai/flows/estimate-cooling-load.ts';
import '@/ai/flows/suggest-optimal-ac-placement.ts';
import '@/ai/flows/define-airflow-direction.ts';