import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useTheme } from '@/app/hooks';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme === 'light' ? 'light' : 'dark'}
      position="top-center"
      className="toaster group"
      {...props}
    />
  );
};

export { Toaster };
