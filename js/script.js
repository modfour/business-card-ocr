const isSupportedFileFormat = function(fileName){
    const fileType = fileName.split('.').pop();
    if (fileType === 'bmp' || fileType === 'jpg' || fileType === 'png' || fileType === 'pbm'){
        return true;
    }
    return false;
}
const app = Vue.createApp({
    data() {
        return {
            dataUrl: '',
            filepath: '',
            isFileSelected: false
        }
    },
    methods: {
        readImageFile: function(){
            const inputFileDOM = document.getElementById('inputFile');
            this.filepath = inputFileDOM.files[0].name;

            if(isSupportedFileFormat(this.filepath)){
                const fileReader = new FileReader();
                fileReader.onload = (function(e){
                    vm.dataUrl = e.target.result;
                });
                fileReader.readAsDataURL(inputFileDOM.files[0]);
                this.isFileSelected = true;
            }else{
                alert('.jpg,.png,.bmp,.pbmのみサポートしています。')
            }
        }
    }
});

const vm = app.mount('#container');