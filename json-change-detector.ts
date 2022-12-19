class JsonChangeModel {

    key : string;
    oldDto : unknown;
    newDto : unknown;

    constructor(key? , oldDto? , newDto?){
        this.key = key;
        this.oldDto = oldDto
        this.newDto = newDto
    }
}


export class JsonChangeDetector{

    static changes : any[] = []
    // static keyPipe = new ChangeEnkeyToIrPipe()
    // static intPipe = new ChnageIntEnumToStringPipe()
    
    //? split Dto items with its type
    static splitWithType(prev , current , text){     
        this.changes = []
        const commonKeys = this.getKeysOfObject(prev , current)
        for(let key of commonKeys){
            if (prev[key] instanceof Array || current[key] instanceof Array ) {
                this.compareListOfString(prev[key] , current[key] , key);
            }else{
                if (prev[key] instanceof Object || current[key] instanceof Object ) {
                    this.compareListOfObjects(prev[key] , current[key] , key , text)
                }else{
                    if (this.transformInt(prev[key] , key , text)) {
                        prev[key] != current[key] && this.changes.push(`${this.transformString(key , text)} from ${this.transformInt(prev[key] , key , text )} to ${this.transformInt(current[key] , key , text)} changed`)
                    }else{
                        prev[key] != current[key] && this.changes.push(`${this.transformString(key , text)} to ${this.transformInt(current[key] , key , text )} changed`)
                    }
                }
            }
        }
        return this.changes
    }
    
    //? compare item of list if value is object
    static compareListOfObjects(prev , current , mainKey , text){           
        let prevName = this.getKeysOfObject(prev)
        let currentName =  this.getKeysOfObject(current)
        for(let name of prevName){
            if (currentName.includes(name)) {
                if (prev[name].compareValue != current[name].compareValue) {
                    this.changes.push(`${prev[name].compareText} ${this.transformString(prev[name].name , text)} from ${prev[name].compareValue} to ${current[name].compareValue} changed`)
                }
            }else{
                this.changes.push(`${this.transformString(prev[name].name , text)}  deleted from ${this.transformString(mainKey , text)}`)
            }
        }
        for(let name of currentName){
            if (!prevName.includes(name)) {
                this.changes.push(`${this.transformString(current[name].name , text)} added with ${current[name].compareText} ${current[name].compareValue} to ${this.transformString(mainKey , text)}`)
            }
        }
    }
    
    //? compare item of list if value is string
    static compareListOfString(prev , current , key?){
        const temp = new JsonChangeModel(key , this.createSentenceForArray(prev) , this.createSentenceForArray(current))
        if (prev.length != current.length) {
            this.changes.push(temp)
        }else{
            for(let tag of prev){
                if (!current.includes(tag)) {
                    this.changes.push(temp)
                }
            }
        }
    }

    //? get keys of object
    static getKeysOfObject(prev? , current?){
        if(!current){
            const keys = [...new Set([...Object.keys(prev)])]
            return keys
        }
        const keys = [...new Set([...Object.keys(prev) , ...Object.keys(current)])]
        return keys
    }
    
    //? create sentence if for list of string
    static createSentenceForArray(list){
        let string = ''
        for(let item of list){
            string += list + '' + 'and' + item
        }
        return string
    }

    static transformString(value , text?){
        return value
    }

    static transformInt(value , key , text){
        return value
    }
}
