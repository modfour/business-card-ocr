const isSupportedFileFormat = function(fileName){
    const fileType = fileName.split('.').pop();
    if (fileType === 'bmp' || fileType === 'jpg' || fileType === 'png' || fileType === 'pbm'){
        return true;
    }
    return false;
}

const convertText = function(string){
    const map = [
        { searchValue:'⓪', replaceValue:'0' },
        { searchValue:'①', replaceValue:'1' },
        { searchValue:'②', replaceValue:'2' },
        { searchValue:'③', replaceValue:'3' },
        { searchValue:'④', replaceValue:'4' },
        { searchValue:'⑤', replaceValue:'5' },
        { searchValue:'⑥', replaceValue:'6' },
        { searchValue:'⑦', replaceValue:'7' },
        { searchValue:'⑧', replaceValue:'8' },
        { searchValue:'⑨', replaceValue:'9' },
        { searchValue:' ', replaceValue:'' }
    ];
    let result = string;
    map.forEach(function(pattern){
        console.log(pattern.searchValue);
        result = result.replace(new RegExp(pattern.searchValue, 'g'),pattern.replaceValue);
    });
    return result;
}

const app = Vue.createApp({
    data() {
        return {
            dataUrl: '',
            filepath: '',
            isFileSelected: false,
            recognizedText: ''
        }
    },
    methods: {
        runOcr: function(){
            Tesseract.recognize(this.dataUrl, 'jpn', 
                { logger: m => console.log(m) }
            ).then(({ data : { text } }) => {
                console.log(text);
                this.recognizedText = convertText(text);
            })
        },

        readImageFile: function(){
            const inputFileDOM = document.getElementById('inputFile');
            this.filepath = inputFileDOM.files[0].name;

            if(isSupportedFileFormat(this.filepath)){
                const fileReader = new FileReader();
                const that = this;
                fileReader.onload = (function(e){
                    that.dataUrl = e.target.result;
                    that.runOcr();
                });
                fileReader.readAsDataURL(inputFileDOM.files[0]);
                this.isFileSelected = true;
            }else{
                alert('.jpg,.png,.bmp,.pbmのみサポートしています。')
            }
        },        
    }
});

const vm = app.mount('#container');