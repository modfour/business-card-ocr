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
        result = result.replace(new RegExp(pattern.searchValue, 'g'),pattern.replaceValue);
    });
    return result;
}

const app = Vue.createApp({
    data() {
        return {
            dataUrl: '',
            filepath: '',
            isFileSelected: false, // for debug only
            isFileCaptured: false,
            recognizedText: '',
            options: [],
            progressWidth: 'width: 0%',
            progressNumber: 0
        }
    },
    methods: {
        runOcr: function(){
            let lastStatus = '';
            let lastProgress = 0;
            const that = this;
            Tesseract.recognize(this.dataUrl, 'jpn', {
                logger: m => {
                    let tmpProgressNumber = that.progressNumber / 25.0
                    console.log(m);
                    if (lastStatus === m['status']){
                        tmpProgressNumber -= lastProgress;
                    }
                    lastProgress = m['status'];
                    lastProgress = m['progress'];
                    tmpProgressNumber += lastProgress

                    that.progressNumber = tmpProgressNumber * 25.0;
                    that.progressWidth = 'width: ' + tmpProgressNumber * 25.0 + '%';
                }
            }).then(({ data : { text } }) => {
                this.isFileCaptured = true;
                this.recognizedText = convertText(text);
                this.options = convertText(text).split('\n');
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

const makeTimeStamp = function(){
    const now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
}

const createVcfString = function(){
    let result = '';
    result += 'BEGIN:VCARD\r\n';
    result += 'VERSION:3.0\r\n';
    result += 'FN:'             + document.getElementById('personalName'    ).value + '\r\n';
    result += 'EMAIL:'          + document.getElementById('email'           ).value + '\r\n';
    result += 'TEL;WORK;VOICE:' + document.getElementById('phoneNumber'     ).value + '\r\n';
    result += 'ORG:'            + document.getElementById('companyName'     ).value + ';'
                                + document.getElementById('departmentName'  ).value + '\r\n';
    result += 'REV:'            + makeTimeStamp()                                   + '\r\n';
    result += 'END:VCARD';
    return result;
}

const exportVcfFile = function(){
    const str = createVcfString();
    const aryStr = str.split('');
    const blob = new Blob(aryStr, {type:"text/plain"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export.vcf';
    link.click();
}

const vm = app.mount('#container');