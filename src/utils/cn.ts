import clsx, {type ClassValue} from 'clsx';

/** Tailwind 클래스를 조건부로 결합한다. clsx 래퍼. */
export const cn = (...inputs: ClassValue[]) => clsx(...inputs);
