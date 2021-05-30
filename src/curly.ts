const TOKENIZER = /({+)([^{}]*)(}+)/gm;
const TRIMMER = /(^ *'|' *$)|(^ *"|" *$)|(^ *`|` *$)|(^ *| *$)/gm;

const LEFT_BRACE_WILD = /({+)(?:[^{}]+|$)(?![^{]*})/gm;
const LEFT_BRACE_DOUBLE = /{{/gm;
const RIGHT_BRACE_WILD = /(?<=(}|^)[^{}]+)}+/gm;
const RIGHT_BRACE_DOUBLE = /}}/gm;

export function format(format: string, source: any, emptyVal: string = ''): string {
    let output = format.
        replace(LEFT_BRACE_WILD, (match: string, brace: string) =>
            match.replace(brace, brace.slice(0, Math.floor(brace.length/2)))).
        replace(RIGHT_BRACE_WILD, (match: string, brace: string) =>
            match.replace(brace, brace.slice(0, Math.floor(brace.length/2)))).
        replace(TOKENIZER, (_: string, l: string, key: string, r: string) => {
            if(l.length === 2 || r.length === 2) /* not a valid format token */ {
                if(l.length % 2)
                    l = l.replace('{', '')

                if(r.length % 2)
                    r = r.replace('}', '')

                return l.replace(LEFT_BRACE_DOUBLE, '{') + key + r.replace(RIGHT_BRACE_DOUBLE, '}');
            }
            
            let foundKey = Object.keys(source).find((sourceKey: string) => 
                sourceKey === key.replace(TRIMMER, ''));

            if(l.length % 2)
                l = l.replace('{', '')

            if(r.length % 2)
                r = r.replace('}', '')

            return l.replace(LEFT_BRACE_DOUBLE, '{') + 
                (foundKey? source[<string>foundKey] ?? emptyVal: emptyVal) +
                r.replace(RIGHT_BRACE_DOUBLE, '}');
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