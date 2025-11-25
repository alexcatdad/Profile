import type { Dictionary } from '@/app/dictionaries/en';
import { NavigationClient } from './NavigationClient';

interface NavigationProps {
  dictionary: Dictionary;
}

export function Navigation({ dictionary }: NavigationProps) {
  return <NavigationClient dictionary={dictionary} />;
}
