export default class Curly {

    private static TOKENIZER = /({+)([^{}]*)(}+)/gm;
    private static TRIMMER = /(^ *'|' *$)|(^ *"|" *$)|(^ *`|` *$)|(^ *| *$)/gm;

    private _format: string;
    private _source: any;
    private _emptyVal: string;

    constructor (format: string, source: any = {}, emptyVal: string = '') {
        this._format = format;
        this._source = source;
        this._emptyVal = emptyVal;
    }

    public get format(): string {
        return this._format;
    }

    public set format(value: string) {
        this._format = value;
    }

    public get source(): any {
        return this._source;
    }

    public set source(value: any) {
        this._source = value;
    }

    public get emptyVal(): string {
        return this._emptyVal;
    }

    public set emptyVal(value: string) {
        this._emptyVal = value;
    }

    public getKeys(reduceDuplicates: boolean = false): string[] {
        let output = <string[]>Array.from(this._format.matchAll(Curly.TOKENIZER), 
            (t: RegExpMatchArray) => 
                (t[1].length % 2 && t[3].length % 2)? t[2].replace(Curly.TRIMMER, ''): null).
            filter((k: string|null) => k);

        if(reduceDuplicates)
            output = output.reduce((accumulator: string[], value: string) => {
                if(!accumulator.includes(value))
                    accumulator.push(value);
                return accumulator;
            }, [])

        return output;
    }

    public toString(): string {
        const LEFT_BRACE_WILD = /({+)(?:[^{}]+|$)(?![^{]*})/gm;
        const LEFT_BRACE_DOUBLE = /{{/gm;
        const RIGHT_BRACE_WILD = /(?<=(}|^)[^{}]+)}+/gm;
        const RIGHT_BRACE_DOUBLE = /}}/gm;
        let output = this._format.
            replace(LEFT_BRACE_WILD, (match: string, brace: string) =>
                match.replace(brace, brace.slice(0, Math.floor(brace.length/2)))).
            replace(RIGHT_BRACE_WILD, (match: string, brace: string) =>
                match.replace(brace, brace.slice(0, Math.floor(brace.length/2)))).
            replace(Curly.TOKENIZER, (_: string, l: string, key: string, r: string) => {
                if(l.length === 2 || r.length === 2) /* not a valid format token */ {
                    if(l.length % 2)
                        l = l.replace('{', '')

                    if(r.length % 2)
                        r = r.replace('}', '')

                    return l.replace(LEFT_BRACE_DOUBLE, '{') + key + r.replace(RIGHT_BRACE_DOUBLE, '}');
                }
                
                let foundKey = Object.keys(this._source).find((sourceKey: string) => 
                    sourceKey === key.replace(Curly.TRIMMER, ''));

                if(l.length % 2)
                    l = l.replace('{', '')

                if(r.length % 2)
                    r = r.replace('}', '')

                return l.replace(LEFT_BRACE_DOUBLE, '{') + 
                    (foundKey? this._source[<string>foundKey] ?? this._emptyVal: this._emptyVal) +
                    r.replace(RIGHT_BRACE_DOUBLE, '}');
        });
        return output;
    }
}

export function key(name: string): string {
    return '{' + name + '}';
}