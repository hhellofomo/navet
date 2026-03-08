import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useTheme } from '../../hooks';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner theme={theme === 'light' ? 'light' : 'dark'} className="toaster group" {...props} />
  );
};

export { Toaster };
