export type Effect =  General | Foreground | Background
export type ConsoleEffects =  {General: typeof General, Foreground: typeof Foreground, Background: typeof Background}

enum General {
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m"
}

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

export const EffectsOptions: ConsoleEffects = {
    General,
    Foreground,
    Background
};
  
export const ConsoleEffects = {
    Reset: () => {
        console.log(EffectsOptions.General.Reset);
    },
    Log: (effects: Effect[] | null, ...data: any[]) => {
        const effectString = effects?.join('') ?? '';
        const dataWithEffects = data.map((v, i) => `${i == 0 ? effectString : ''}${v}${i == data.length - 1 ? EffectsOptions.General.Reset : ''}`);
        console.log(...dataWithEffects);
    },
    Red: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Red);
        ConsoleEffects.Log(effects, ...data);
    },
    Green: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Green);
        ConsoleEffects.Log(effects, ...data);
    },
    Yellow: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Yellow);
        ConsoleEffects.Log(effects, ...data);
    },
    Blue: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Blue);
        ConsoleEffects.Log(effects, ...data);
    },
    Magenta: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Magenta);
        ConsoleEffects.Log(effects, ...data);
    },
    Cyan: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Cyan);
        ConsoleEffects.Log(effects, ...data);
    },
    White: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.White);
        ConsoleEffects.Log(effects, ...data);
    },
    Gray: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Gray);
        ConsoleEffects.Log(effects, ...data);
    },
    Black: (effects: Effect[] | null, ...data: any[]) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.Black);
        ConsoleEffects.Log(effects, ...data);
    }
}