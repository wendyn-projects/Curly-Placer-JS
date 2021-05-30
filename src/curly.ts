const TOKENIZER = /({+)([^{}]*)(}+)/gm;
const TRIMMER = /(^ *'|' *$)|(^ *"|" *$)|(^ *`|` *$)|(^ *| *$)/gm;

const WILD_LEFT_BRACE = /({+)(?:[^{}]+|$)(?![^{]*})/gm;
const WILD_RIGHT_BRACE = /(?<=(}|^)[^{}]+)}+/gm;

export function format(format: string, source: any, emptyVal: string = ''): string {
    let output = format.
        replace(WILD_LEFT_BRACE, (match: string, brace: string) =>
            match.replace(brace, brace.slice(0, Math.floor(brace.length/2)))).
        replace(WILD_RIGHT_BRACE, (match: string, brace: string) =>
            match.replace(brace, brace.slice(0, Math.floor(brace.length/2)))).
        replace(TOKENIZER, (_: string, l: string, key: string, r: string) => {
            if(l.length === 2 || r.length === 2) /* not a valid format token */ {
                return l.slice(0, Math.floor(l.length/2)) + key + r.slice(0, Math.floor(r.length/2));
            }
            
            let foundKey = Object.keys(source).find((sourceKey: string) => 
                sourceKey === key.replace(TRIMMER, ''));

            return l.slice(0, Math.floor(l.length/2)) + 
                (foundKey? source[<string>foundKey] ?? emptyVal: emptyVal) +
                r.slice(0, Math.floor(r.length/2));
    });
    return output;
}

export function getKeys(format: string, reduceDuplicates: boolean = false): string[] {
    let output = <string[]>Array.from(format.matchAll(TOKENIZER), 
        (t: RegExpMatchArray) => 
            (t[1].length % 2 && t[3].length % 2)? t[2].replace(TRIMMER, ''): null).
        filter((k: string|null) => k);

    if(reduceDuplicates)
        output = output.reduce((accumulator: string[], value: string) => {
            if(!accumulator.includes(value))
                accumulator.push(value);
            return accumulator;
        }, [])

    return output;
}

export function key(name: string): string {
    return '{' + name + '}';
}