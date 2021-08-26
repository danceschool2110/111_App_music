const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'F8_PLAYER';
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    songs: [
        {
            name: 'Sài Gòn Bao Nhiêu Đèn Đỏ',
            singer: 'Phạm Hồng Phước',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Chỉ Là Em Giấu Đi',
            singer: 'Bích Phượng',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Xa Anh Chậm Chậm Thôi',
            singer: 'Sĩ Thanh',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Ngã Tư Đường',
            singer: 'Hồ Quang Hiếu',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Phố Không Em',
            singer: 'Thái Đinh',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Như Loài Mèo',
            singer: 'Tạ Quang Thắng',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Những Đêm Lặng Câm',
            singer: 'Bích Phương',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Tối Nay',
            singer: 'Thái Đinh',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Muộn Rồi Mà Sao Còn ',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Độ Tộc 2',
            singer: 'Phúc Du-Masew-Pháo',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        },{
            name: 'Buồn Không Em',
            singer: 'Đạt G',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.png'
        },{
            name: 'Gặp Gỡ, Yêu Đương Và Được Bên Em ',
            singer: 'Phan Mạnh Quỳnh',
            path: './assets/music/song12.mp3',
            image: './assets/img/song12.jpg'
        }
    ],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}, 
    render: function(){
        const htmls=this.songs.map((song,index)=>{
            return `
            <div class="song" data-index = ${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //xu ly quay CD va dung
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000, //10000ms = 10s
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        
        //xu ly phong to thu nho cai CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;
            
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
        
            cd.style.opacity = newcdWidth / cdWidth;
        }

        //xu ly khi play
        playBtn.onclick = function (){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }

        //khi song duoc play
        audio.onplay=function(){
            _this.isPlaying=true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
         //khi song bi pause
        audio.onpause = function(){
            _this.isPlaying=false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        //khi tien do bai hat thay doi, chay cai input
        audio.ontimeupdate = function (){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        //xu ly tua bai hat
        progress.oninput = function(e){
            //cho minh tời đến, tính theo giây
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
            audio.play();
        }

        //khi next songs
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        }
        //khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom ){
                _this.randomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        }
        //xuwr ly bat tat chet do ran dom
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom);
        }

        //xu ly next song khi bai hat ket thuc
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            }
            else{
                nextBtn.click();
            }
        }
        //khi muon phat lai bai hat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }
        //Kich hoat che do active cho bai hat dc phat
        audio.onloadstart = function () {
            const currentPlaySong = $$('.song');
            const activedSong = $('.song.active');
            if (activedSong) {
                activedSong.classList.remove('active');
            }
            currentPlaySong[_this.currentIndex].classList.add('active');
        }
        //Lang nghe hanh vi click vao playlist
        playlist.onclick = function(e){
            //xu ly click khi xu ly vao song
            const songNotActive = e.target.closest('.song:not(.active)');
            const option = e.target.closest('.option');
            if(songNotActive||option){
                //xu ly khi click vao bai hat
                if(songNotActive){
                    _this.currentIndex = Number(songNotActive.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                }

                //xu ly click vao option
            }
        }
    },
    setConfig: function(key,value){
        this.config[key]=value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    scrollToActiveSong: function(){
        setTimeout(function(){
            if(this.currentIndex <=2 ){
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            }else{
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }
        },300)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex > this.songs.length-1){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function(){
        let newIndex;
        var count = 0;
        var arrayTemp=[];
        newIndex = Math.floor(Math.random() * this.songs.length);       
        if(count >0) {
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
                var isCheck= arrayTemp.includes(newIndex);
            }while(isCheck == true)
        }
        arrayTemp[count] = newIndex;
        this.currentIndex = newIndex;
        if(count == this.songs.length-1){
            arrayTemp=[];
            count=-1;
        }
        count++;
        this.loadCurrentSong();
    },
    start: function(){
        //cau hinh lai
        this.loadConfig();
        //dinh nghia cac thuoc tinh cho object
        this.defineProperties();

        //Lang nghe va xu ly cac su kien (Dom events)
        this.handleEvents();

        //tai htong tin bai hat dau tien vao UI khi chay
        this.loadCurrentSong();
        //Render playlist
        this.render();

        randomBtn.classList.toggle('active',this.isRandom);
        repeatBtn.classList.toggle('active',this.isRepeat);
    }
}

app.start();