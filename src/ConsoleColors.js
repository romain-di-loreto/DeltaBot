export const EffectsOptions = {
    Reset:      "\x1b[0m",
    Bright:     "\x1b[1m",
    Dim:        "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink:      "\x1b[5m",
    Reverse:    "\x1b[7m",
    Hidden:     "\x1b[8m",

    Foreground: {
        FgBlack:    "\x1b[30m",
        FgRed:      "\x1b[31m",
        FgGreen:    "\x1b[32m",
        FgYellow:   "\x1b[33m",
        FgBlue:     "\x1b[34m",
        FgMagenta:  "\x1b[35m",
        FgCyan:     "\x1b[36m",
        FgWhite:    "\x1b[37m",
        FgGray:     "\x1b[90m"
    },

    Background: {
        BgBlack:    "\x1b[40m",
        BgRed:      "\x1b[41m",
        BgGreen:    "\x1b[42m",
        BgYellow:   "\x1b[43m",
        BgBlue:     "\x1b[44m",
        BgMagenta:  "\x1b[45m",
        BgCyan:     "\x1b[46m",
        BgWhite:    "\x1b[47m",
        BgGray:     "\x1b[100m"
    }
}

export const ConsoleEffects = {
    Reset: () => {
        console.log(EffectsOptions.Reset);
    },
    Log: (effects, ...data) => {
        const effectString = effects?.join('') ?? '';
        const dataWithEffects = data.map((v, i) => `${i == 0 ? effectString : ''}${v}${i == data.length - 1 ? EffectsOptions.Reset : ''}`);
        console.log(...dataWithEffects);
    },
    Red: (effects, ...data) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.FgRed);
        ConsoleEffects.Log(effects, ...data);
    },
    Green: (effects, ...data) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.FgGreen);
        ConsoleEffects.Log(effects, ...data);
    },
    Yellow: (effects, ...data) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.FgYellow);
        ConsoleEffects.Log(effects, ...data);
    },
    Blue: (effects, ...data) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.FgBlue);
        ConsoleEffects.Log(effects, ...data);
    },
    Magenta: (effects, ...data) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.FgMagenta);
        ConsoleEffects.Log(effects, ...data);
    },
    Cyan: (effects, ...data) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.FgCyan);
        ConsoleEffects.Log(effects, ...data);
    },
    White: (effects, ...data) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.FgWhite);
        ConsoleEffects.Log(effects, ...data);
    },
    Gray: (effects, ...data) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.FgGray);
        ConsoleEffects.Log(effects, ...data);
    },
    Black: (effects, ...data) => {
        if(effects == null)
            effects = [];
        effects.push(EffectsOptions.Foreground.FgBlack);
        ConsoleEffects.Log(effects, ...data);
    }
}
