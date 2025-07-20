import {Mail} from 'lucide-react';

interface ContactButtonProps {
  onClick: () => void;
  title: string;
  email: string;
}

const ContactButton = ({onClick, title, email}: ContactButtonProps) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-md bg-slate-50 p-3 text-left transition-colors hover:bg-slate-100 dark:bg-[#181A20] dark:hover:bg-[#23242B]"
  >
    <Mail size={16} className="text-slate-600 dark:text-slate-300" />
    <div>
      <div className="text-sm font-medium text-slate-800 dark:text-white">
        {title}
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-300">{email}</div>
    </div>
  </button>
);

export default ContactButton;
