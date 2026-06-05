import {MenuCategoryLabel} from '@/constants/menu';
import {MenuType} from '@/types/menu';

interface CourseRowProps {
  menu: MenuType;
}

const CourseRow = ({menu}: CourseRowProps) => {
  const total = menu.items.reduce((sum, item) => sum + (item.kcal ?? 0), 0);

  return (
    <div className="border-line border-b px-6 py-5 last:border-b-0">
      <div className="flex items-baseline gap-2.5">
        <span className="text-accent-text text-[11px] font-extrabold tracking-wider">
          {MenuCategoryLabel[menu.category].ko}
        </span>
        {total > 0 && (
          <span className="text-muted ml-auto text-xs font-semibold">
            {total} kcal
          </span>
        )}
      </div>
      <p className="text-ink mt-1.5 text-[15px] leading-relaxed font-semibold">
        {menu.items.map((item, i) => (
          <span key={item.name} className="whitespace-nowrap">
            {item.name}
            {item.kcal > 0 && (
              <i className="text-muted ml-0.5 text-[10.5px] font-semibold not-italic">
                {`${item.kcal}kcal`}
              </i>
            )}
            {i < menu.items.length - 1 && (
              <span className="mx-1.5 text-[#C9C9C6]">·</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
};

export default CourseRow;
