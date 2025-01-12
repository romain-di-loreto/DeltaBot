// Doxygen comments made with ChatGPT, cause am lazy.

/**
 * Defines a type that can be any of the General, Foreground, or Background enums.
 */
export type Effect = General | Foreground | Background;

/**
 * Defines the structure of ConsoleEffects, containing General, Foreground, and Background enums.
 */
export type ConsoleEffects = { General: typeof General, Foreground: typeof Foreground, Background: typeof Background };

/**
 * Enum representing general console text effects, such as brightness and visibility.
 */
enum General {
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m"
}

/**
 * Enum representing foreground text colors for console output.
 */
enum Foreground {
    Black = "\x1b[30m",
    Red = "\x1b[31m",
    Green = "\x1b[32m",
    Yellow = "\x1b[33m",
    Blue = "\x1b[34m",
    Magenta = "\x1b[35m",
    Cyan = "\x1b[36m",
    White = "\x1b[37m",
    Gray = "\x1b[90m"
}

/**
 * Enum representing background text colors for console output.
 */
enum Background {
    Black = "\x1b[40m",
    Red = "\x1b[41m",
    Green = "\x1b[42m",
    Yellow = "\x1b[43m",
    Blue = "\x1b[44m",
    Magenta = "\x1b[45m",
    Cyan = "\x1b[46m",
    White = "\x1b[47m",
    Gray = "\x1b[100m"
}

/**
 * A constant object grouping all console effect enums (General, Foreground, and Background).
 */
export const EffectsOptions: ConsoleEffects = {
    General,
    Foreground,
    Background
};

/**
 * Provides utility functions for logging with console effects such as colors and text styles.
 */
export const ConsolePlus = {
    /**
     * Resets the console output to default settings.
     */
    Reset: () => {
        console.log(EffectsOptions.General.Reset);
    },

    /**
     * Logs messages to the console with optional effects applied.
     * 
     * @param {Effect[]} effects - An array of effects (colors or styles) to apply to the text.
     * @param {any[]} data - The messages to log.
     */
    Log: (effects: Effect[] | null, ...data: any[]) => {
        const effectString = effects?.join('') ?? '';
        const dataWithEffects = data.map((v, i) => `${i == 0 ? effectString : ''}${v}${i == data.length - 1 ? EffectsOptions.General.Reset : ''}`);
        console.log(...dataWithEffects);
    },

    /**
     * Logs messages to the console in red text with optional additional effects.
     * 
     * @param {Effect[]} effects - An array of effects (colors or styles) to apply to the text.
     * @param {any[]} data - The messages to log.
     */
    Red: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Red);
        ConsolePlus.Log(effects, ...data);
    },

    /**
     * Logs messages to the console in green text with optional additional effects.
     * 
     * @param {Effect[]} effects - An array of effects (colors or styles) to apply to the text.
     * @param {any[]} data - The messages to log.
     */
    Green: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Green);
        ConsolePlus.Log(effects, ...data);
    },

    /**
     * Logs messages to the console in yellow text with optional additional effects.
     * 
     * @param {Effect[]} effects - An array of effects (colors or styles) to apply to the text.
     * @param {any[]} data - The messages to log.
     */
    Yellow: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Yellow);
        ConsolePlus.Log(effects, ...data);
    },

    /**
     * Logs messages to the console in blue text with optional additional effects.
     * 
     * @param {Effect[]} effects - An array of effects (colors or styles) to apply to the text.
     * @param {any[]} data - The messages to log.
     */
    Blue: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Blue);
        ConsolePlus.Log(effects, ...data);
    },

    /**
     * Logs messages to the console in magenta text with optional additional effects.
     * 
     * @param {Effect[]} effects - An array of effects (colors or styles) to apply to the text.
     * @param {any[]} data - The messages to log.
     */
    Magenta: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Magenta);
        ConsolePlus.Log(effects, ...data);
    },

    /**
     * Logs messages to the console in cyan text with optional additional effects.
     * 
     * @param {Effect[]} effects - An array of effects (colors or styles) to apply to the text.
     * @param {any[]} data - The messages to log.
     */
    Cyan: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Cyan);
        ConsolePlus.Log(effects, ...data);
    },

    /**
     * Logs messages to the console in white text with optional additional effects.
     * 
     * @param {Effect[]} effects - An array of effects (colors or styles) to apply to the text.
     * @param {any[]} data - The messages to log.
     */
    White: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.White);
        ConsolePlus.Log(effects, ...data);
    },

    /**
     * Logs messages to the console in gray text with optional additional effects.
     * 
     * @param {Effect[]} effects - An array of effects (colors or styles) to apply to the text.
     * @param {any[]} data - The messages to log.
     */
    Gray: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Gray);
        ConsolePlus.Log(effects, ...data);
    },

    /**
     * Logs messages to the console in black text with optional additional effects.
     * 
     * @param {Effect[]} effects - An array of effects (colors or styles) to apply to the text.
     * @param {any[]} data - The messages to log.
     */
    Black: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Black);
        ConsolePlus.Log(effects, ...data);
    }
};
