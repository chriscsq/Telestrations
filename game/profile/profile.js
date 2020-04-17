// Assume cookies should be set otherwise setting to default values
if (Cookies.get('username') === undefined) {
  let defaultUser = {
      username: 'Anonymous',
      usericon: 'fas fa-crow',
      iconColor: '#5A5ACA',
      bannerColor: '#5ACA5A',
      usernameColor: '#CA5A5A',
  };
  for (key in defaultUser) {
      Cookies.set(key, defaultUser[key]);
  }
}

// Retrieve sketchbook data from firebase
let previousBook = [{vote : '+1', word : 'Dog', images : ['./images/dog1.jpg', './images/dog2.jpg', './images/dog3.jpg'], owners : ['David', 'Chris', 'Inderpreet']},
                    {vote : 'N/A', word : 'N/A', images : [], owners : []},
                    {vote : 'N/A', word : 'N/A', images : [], owners : []}]

let savedBook =    [{vote : '+4', word : 'Goat', images : ['./images/goat1.jpeg', './images/goat2.jpg', './images/goat3.png'], owners : ['Chintav', 'Hassan', 'Other guy']},
                    {vote : 'N/A', word : 'N/A', images : [], owners : []},
                    {vote : 'N/A', word : 'N/A', images : [], owners : []}]

let profile = new Vue({
  el: '#profile',
  data: {
    update : '',
    userInfo: { 
      username: Cookies.get('username'),
      userColor: Cookies.get('usernameColor'),
      bannerColor: Cookies.get('bannerColor'),
      avatar: Cookies.get('usericon'),
      avatarColor: Cookies.get('iconColor')
    },
    modalInfo: {
      userColor: '',
      bannerColor: '',
      avatar: '',
      avatarColor: ''
    },
    modalAvatar: {
      avatar: '',
      avatarColor: ''
    },
    prevSketchbook: {
      vote : [previousBook[0].vote, previousBook[1].vote, previousBook[2].vote],
      word : [previousBook[0].word, previousBook[1].word, previousBook[2].word],
      images : [previousBook[0].images, previousBook[1].images, previousBook[2].images],
      owners : [previousBook[0].owners, previousBook[1].owners, previousBook[2].owners]
    },
    savedSketchbook: {
      vote : [savedBook[0].vote, savedBook[1].vote, savedBook[2].vote],
      word : [savedBook[0].word, savedBook[1].word, savedBook[2].word],
      images : [savedBook[0].images, savedBook[1].images, savedBook[2].images],
      owners : [savedBook[0].owners, savedBook[1].owners, savedBook[2].owners]
    },

    displaySketchbook : {
      vote: 0,
      word: '',
      images: '',
      counter : 1,
      counterSize : 0,
      currentSide: 0,
      currentSlot: 0,
      owner : '',
      showSaveButton : true,
      saveSlot : '1',
      bookSlot : '1'
    },
    userColorPicker : {
      colorPick : ['#aa96da','#fcbad3','#ffffd2','#a8d8ea','#222831',
      '#ffd3b5','#00adb5', '#eeeeee', '#f38181','#eaffd0'],
      option : 'banner'
    },
    avatarPicker : {
      avatar : ['fas fa-cat', 'fas fa-dragon', 'fas fa-dog ', 'fas fa-dove ', 'fas fa-fish',
                'fas fa-frog', 'fas fa-hippo', 'fas fa-horse', 'fas fa-kiwi-bird', 'fas fa-spider'],
      avatarColor : ['fa-square avatar-color-1 ', 'fa-square avatar-color-2 ', 'fa-square avatar-color-3 ', 'fa-square avatar-color-4' , 'fa-square avatar-color-5 ',
                     'fa-square avatar-color6 ', 'fa-square avatar-color-7 ', 'fa-square avatar-color-8 ', 'fa-square avatar-color-9 ', 'fa-square avatar-color-10 '],
      option : 'avatar',
      colorSelection : ['red', 'brown', 'blue', 'orange', 'gold', 'black', 'purple', 'green', 'indigo', 'gray']
    }
  },
  computed : {
    avatarModalSelection : function () {
      if(this.avatarPicker.option === 'avatar') {
        return this.avatarPicker.avatar
      } else {
        return this.avatarPicker.avatarColor
      }
    },
    currentSketchbook : function () {
      if(this.displaySketchbook.currentSide === 0) {
        return this.prevSketchbook.images[this.displaySketchbook.currentSlot][this.displaySketchbook.counter-1]
      } else {
        return this.savedSketchbook.images[this.displaySketchbook.currentSlot][this.displaySketchbook.counter-1]
      }
    },
    currentOwner : function () {
      if(this.displaySketchbook.currentSide === 0) {
        return this.prevSketchbook.owners[this.displaySketchbook.currentSlot][this.displaySketchbook.counter-1]
      } else {
        return this.savedSketchbook.owners[this.displaySketchbook.currentSlot][this.displaySketchbook.counter-1]
      }
    },
    action : function () {
      if(this.displaySketchbook.counter % 2 === 1) {
        return 'Drawn'
      } else {
        return 'Guessed'
      }
    }
  },
  created : function (){
    // test();
  },
  methods: {
    checkNA : function (whichSide, whichSlot) {
      if(whichSide === 0) {
        if(this.prevSketchbook.vote[whichSlot] === 'N/A') {
          return true
        } else {
          return false
        }
      } else {
        if(this.savedSketchbook.vote[whichSlot] === 'N/A') {
          return true
        } else {
          return false
        }
      }
    },
    setSketchbook: function (whichSide, whichSlot) {
      this.displaySketchbook.currentSide = whichSide;
      this.displaySketchbook.currentSlot = whichSlot;
      this.displaySketchbook.counter = 1;
      this.displaySketchbook.counterSize = this.prevSketchbook.images[0].length;
      this.update = '';

      if(whichSide === 0) {
          this.displaySketchbook.vote = this.prevSketchbook.vote[whichSlot];
          this.displaySketchbook.word = this.prevSketchbook.word[whichSlot];
          this.displaySketchbook.images = this.prevSketchbook.images[whichSlot][this.displaySketchbook.counter-1];
          this.displaySketchbook.owner = this.prevSketchbook.owners[whichSlot][this.displaySketchbook.counter-1];
          this.displaySketchbook.showSaveButton = true;

      } else {
          this.displaySketchbook.vote = this.savedSketchbook.vote[whichSlot];
          this.displaySketchbook.word = this.savedSketchbook.word[whichSlot];
          this.displaySketchbook.images = this.savedSketchbook.images[whichSlot][this.displaySketchbook.counter-1];
          this.displaySketchbook.owner = this.savedSketchbook.owners[whichSlot][this.displaySketchbook.counter-1];
          this.displaySketchbook.showSaveButton = false;
      }
      
    },
    setModalColor: function () {
      this.modalInfo.userColor =  this.userInfo.userColor;
      this.modalInfo.bannerColor = this.userInfo.bannerColor;
      this.modalInfo.avatar = this.userInfo.avatar;
      this.modalInfo.avatarColor = this.userInfo.avatarColor;
    },
    setAvatar: function () {
      this.modalAvatar.avatar = this.userInfo.avatar;
      this.modalAvatar.avatarColor = this.userInfo.avatarColor;
    },
    switchModalColor: function (pickNum) {
      if(this.userColorPicker.option === 'banner') {
        this.modalInfo.bannerColor = this.userColorPicker.colorPick[pickNum];
      } else {
        this.modalInfo.userColor = this.userColorPicker.colorPick[pickNum];
      }
      
    },
    switchAvatar: function (pickNum) {
      if(this.avatarPicker.option === 'avatar') {
        this.modalAvatar.avatar = this.avatarPicker.avatar[pickNum];
      } else {
        this.modalAvatar.avatarColor = this.avatarPicker.colorSelection[pickNum];
      }

    },
    saveModalColor: function () {
      this.userInfo.userColor = this.modalInfo.userColor;
      this.userInfo.bannerColor = this.modalInfo.bannerColor;
      Cookies.set('usernameColor', this.modalInfo.userColor);
      Cookies.set('bannerColor', this.modalInfo.bannerColor);
      updateUserData(0, this.modalInfo.userColor, this.modalInfo.bannerColor);
    },
    saveAvatar : function () {
      this.userInfo.avatar = this.modalAvatar.avatar;
      this.userInfo.avatarColor = this.modalAvatar.avatarColor;
      Cookies.set('usericon', this.modalAvatar.avatar);
      Cookies.set('iconColor', this.modalAvatar.avatarColor);
      updateUserData(1, this.modalAvatar.avatar, this.modalAvatar.avatarColor);
    },
    saveBook : function () {
      this.savedSketchbook.vote[this.displaySketchbook.saveSlot-1] = this.displaySketchbook.vote;
      this.savedSketchbook.word[this.displaySketchbook.saveSlot-1] = this.displaySketchbook.word;
      this.savedSketchbook.images[this.displaySketchbook.saveSlot-1] = this.prevSketchbook.images[this.displaySketchbook.currentSlot];
      this.savedSketchbook.owners[this.displaySketchbook.saveSlot-1] = this.prevSketchbook.owners[this.displaySketchbook.currentSlot];
      this.update = 'Book Saved';
      
    },

    counterCheck : function (num) {
      if (this.displaySketchbook.counter + num <= this.displaySketchbook.counterSize && this.displaySketchbook.counter + num >= 1) {
        this.displaySketchbook.counter += num
      }
    }
  }
});