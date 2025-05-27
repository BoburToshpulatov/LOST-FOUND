import { PaletteIcon } from "lucide-react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}

      <button
        tabIndex={0}
        className="btn btn-ghost not-sm:btn-circle  hover:bg-base-content/20  rounded-md text-base-content"
      >
        <PaletteIcon className="size-5" />
        <span className="hidden sm:inline">Themes</span>
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
    w-56 border border-base-content/10"
      >
        {THEMES.map((themeOption) => (
          <button
            key={themeOption.name}
            className={`
                w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors 
                ${
                  themeOption.name === theme
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-base-content/5"
                }`}
            onClick={() => setTheme(themeOption.name)}
          >
            <PaletteIcon className="size-4" />
            <span className="text-sm font-medium">{themeOption.label}</span>

            {/* THEME PREVIEW COLORS */}
            <div className="ml-auto flex gap-1">
              {themeOption.colors.map((color, i) => (
                <span
                  className="size-2 rounded-full"
                  key={i}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
