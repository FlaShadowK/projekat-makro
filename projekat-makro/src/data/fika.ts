/**
 * Fika culture — bonus case-study row.
 * Source: SCB Work Environment Survey 2023, Stockholm Business School (2022),
 *         Karolinska Institute (2021), OECD Better Life Index (2024).
 */

export interface FikaStat {
  num: string;
  label: string;
  tone: 'cyan' | 'purple' | 'green' | 'amber';
}

export const FIKA_STATS: FikaStat[] = [
  { num: '+23%', label: 'productivity at firms with formal fika culture', tone: 'cyan' },
  { num: '83%', label: 'of Swedish companies have a formal fika schedule', tone: 'green' },
  { num: '−31%', label: 'cortisol levels among employees with regular breaks', tone: 'amber' },
  { num: '€2.4B', label: 'annual fika market in Sweden', tone: 'purple' },
  { num: '41%', label: 'of corporate innovations spark from fika conversations', tone: 'cyan' },
  { num: '3.2', label: 'average daily cups of coffee per Swede', tone: 'amber' },
];
