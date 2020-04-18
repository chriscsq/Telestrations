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
      vote : ['', '', ''],
      word : ['', '', ''],
      images : [[], [], []],
      owners : [[], [], []]
    },
    savedSketchbook: {
      // vote : [savedBook[0].vote, savedBook[1].vote, savedBook[2].vote],
      // word : [savedBook[0].word, savedBook[1].word, savedBook[2].word],
      // images : [savedBook[0].images, savedBook[1].images, savedBook[2].images],
      // owners : [savedBook[0].owners, savedBook[1].owners, savedBook[2].owners]
      vote : ['', '', ''],
      word : ['', '', ''],
      images : [[], [], []],
      owners : [[], [], []]
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
  created : async function (){
    // get users data from firestore
    let data = await getSketchbook();
    // console.log("Data: ", data);

    // set data for 3 previous books
    let previousBook1 = data.previousBook1;
    let previousBook2 = data.previousBook2;
    let previousBook3 = data.previousBook3;

    // set data for 3 saved books
    let savedBook1 = data.savedBook1;
    let savedBook2 = data.savedBook2;
    let savedBook3 = data.savedBook3;

    // set word for previous books
    this.prevSketchbook.word[0] = previousBook1[0].word;
    this.prevSketchbook.word[1] = previousBook2[0].word;
    this.prevSketchbook.word[2] = previousBook3[0].word;

    // set word for saved books
    this.savedSketchbook.word[0] = savedBook1[0].word;
    this.savedSketchbook.word[1] = savedBook2[0].word;
    this.savedSketchbook.word[2] = savedBook3[0].word;

    // TEMPORARY : vote is hardcoded until voting system is implemented
    this.prevSketchbook.vote[0] = '+5';
    this.prevSketchbook.vote[1] = '+6';
    this.prevSketchbook.vote[2] = '+7';
 

    var i;
    // push images from database into the 3 previous books
    for (i = 0; i < previousBook1.length; i++) {
      this.prevSketchbook.images[0].push(previousBook1[i].imageURL);
      this.prevSketchbook.owners[0].push(previousBook1[i].imageOwner);
    }
    for (i = 0; i < previousBook2.length; i++) {
      this.prevSketchbook.images[1].push(previousBook2[i].imageURL);
      this.prevSketchbook.owners[1].push(previousBook2[i].imageOwner);
    }
    for (i = 0; i < previousBook3.length; i++) {
      this.prevSketchbook.images[2].push(previousBook3[i].imageURL);
      this.prevSketchbook.owners[2].push(previousBook3[i].imageOwner);
    }

    // push images from database into 3 saved books
    for (i = 0; i < savedBook1.length; i++) {
      this.savedSketchbook.images[0].push(savedBook1[i].imageURL);
      this.savedSketchbook.owners[0].push(savedBook1[i].imageOwner);
    }
    for (i = 0; i < savedBook2.length; i++) {
      this.savedSketchbook.images[1].push(savedBook2[i].imageURL);
      this.savedSketchbook.owners[1].push(savedBook2[i].imageOwner);
    }
    for (i = 0; i < savedBook3.length; i++) {
      this.savedSketchbook.images[2].push(savedBook3[i].imageURL);
      this.savedSketchbook.owners[2].push(savedBook3[i].imageOwner);
    }
        

  },
  methods: {
    checkNA : function (whichSide, whichSlot) {
      if(whichSide === 0) {
        if(this.prevSketchbook.word[whichSlot] === 'N/A') {
          return true
        } else {
          return false
        }
      } else {
        if(this.savedSketchbook.word[whichSlot] === 'N/A') {
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
      this.update = '';

      if(whichSide === 0) {
          this.displaySketchbook.vote = this.prevSketchbook.vote[whichSlot];
          this.displaySketchbook.word = this.prevSketchbook.word[whichSlot];
          this.displaySketchbook.images = this.prevSketchbook.images[whichSlot][this.displaySketchbook.counter-1];
          this.displaySketchbook.owner = this.prevSketchbook.owners[whichSlot][this.displaySketchbook.counter-1];
          this.displaySketchbook.showSaveButton = true;
          this.displaySketchbook.counterSize = this.prevSketchbook.images[whichSlot].length;

      } else {
          this.displaySketchbook.vote = this.savedSketchbook.vote[whichSlot];
          this.displaySketchbook.word = this.savedSketchbook.word[whichSlot];
          this.displaySketchbook.images = this.savedSketchbook.images[whichSlot][this.displaySketchbook.counter-1];
          this.displaySketchbook.owner = this.savedSketchbook.owners[whichSlot][this.displaySketchbook.counter-1];
          this.displaySketchbook.showSaveButton = false;
          this.displaySketchbook.counterSize = this.savedSketchbook.images[whichSlot].length;
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
      let saveSlot = this.displaySketchbook.saveSlot;
      let word = this.displaySketchbook.word;
      let images = this.prevSketchbook.images[this.displaySketchbook.currentSlot];
      let owners = this.prevSketchbook.owners[this.displaySketchbook.currentSlot];
      updateSavedBook(saveSlot, word, images, owners);     
    },

    counterCheck : function (num) {
      if (this.displaySketchbook.counter + num <= this.displaySketchbook.counterSize && this.displaySketchbook.counter + num >= 1) {
        this.displaySketchbook.counter += num
      }
    }
  }
});