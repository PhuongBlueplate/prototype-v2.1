import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { FilesCollection } from 'meteor/ostrio:files';
import './create_profile.html';
import './profile_card.html';

Profile_details = new Mongo.Collection('profile_details');
Kitchen_details = new Mongo.Collection('kitchen_details');

profile_images = new FilesCollection({
  collectionName: 'profile_images',
  storagePath: () => {
      return process.env.PWD + '/public/profile_upload/';
  },
  allowClientCode: false,
  onBeforeUpload(file) {

        if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
          return true;
        } else {
          return 'Please upload image, with size equal or less than 10MB';
        }
  }
});
Meteor.subscribe('files.profile_images.all');

Session.keys = {}

/** function from ostrio **/
Template.create_profile.onRendered(function() {
  Session.keys = {};
})

Template.profile_banner.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.profile_banner.onRendered(function(){
  var check_profile_banner = profile_images.findOne({
    "userId": Meteor.userId(),
    "meta": {"purpose": "banner_picture"}
  });
  if (check_profile_banner) {
    var banner_url = "/profile_upload/" + check_profile_banner._id + check_profile_banner.extensionWithDot;
    $(".profile_banner_area").css("background-image", "url("+ banner_url +")");
    $("#banner_upload_button").text("Change Banner Image");
  } else {
    $(".profile_banner_area").css("background-color", "#E57373");
  }
});

Template.profile_banner.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },

  checkUpload: function() {
     var checkupload = profile_images.findOne({userId: Meteor.userId(),meta:{purpose: "banner_picture"}});
     if (checkupload) {
       return true;
     }
  },
  load_banner: function() {
    banner_url = "/profile_upload/" + this._id + this.extensionWithDot;
    $(".profile_banner_area").css("background-color","");
    $(".profile_banner_area").css("background-image", "url("+ banner_url +")");
  }
});

Template.profile_banner.events({
  'change #banner_file_input': function(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const upload = profile_images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta:{
          purpose: "banner_picture"
        }
      }, false);
      Meteor.call('profile_images.remove',"banner_picture");

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, profile_images) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          Meteor.setTimeout(function(){
            var banner_url = "/profile_upload/" + profile_images._id + profile_images.extensionWithDot;
            $(".profile_banner_area").css("background-color","");
            $(".profile_banner_area").css("background-image", "url("+ banner_url +")");
          },3000);
        /** below is the line that prevents meteor from reloading **/
        }
        Meteor._reload.onMigrate(function () {
          return [false];
        });
        template.currentUpload.set(false);
      });
      upload.start();
    }
  }
});

Template.upload_profile.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.upload_profile.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },

  checkUpload: function() {
    var check_profile_picture = profile_images.findOne({
      "userId": Meteor.userId(),
      "meta": {"purpose": "profile_picture"}
    });
    if (check_profile_picture){
      return true;
    }
  },

  load_profile: function() {
    var profile_id_location = profile_images.findOne({"userId": Meteor.userId(),"meta": {"purpose": "profile_picture"}});
    profile_url = "/profile_upload/" + profile_id_location._id + profile_id_location.extensionWithDot;
    return profile_url;
  }
});

Template.upload_profile.events({
  'change #file_input'(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const upload = profile_images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta:{
          purpose: "profile_picture"
        }
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, profile_images) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          Meteor.setTimeout(function(){
            var profile_url = "/profile_upload/" + profile_images._id + profile_images.extensionWithDot;
            $(".profile_upload_wrapper").css("background-image", "url("+ profile_url +")");
          },3000);
        /** above is the line that prevents meteor from reloading **/
        }
        Meteor._reload.onMigrate(function () {
          return [false];
        });
        template.currentUpload.set(false);
      });
      upload.start();
    }
  }
});

Template.homecook_profile_banner.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});


Template.homecook_profile_banner.onRendered(function(){
  var check_profile_banner = profile_images.findOne({
    "userId": Meteor.userId(),
    "meta": {"purpose": "homecook_banner_picture"}
  });
  if (check_profile_banner) {
    var banner_url = "/profile_upload/" + check_profile_banner._id + check_profile_banner.extensionWithDot;
    $(".homecook_profile_banner_area").css("background-image", "url("+ banner_url +")");
    $("#homecook_banner_upload_button").text("Change Banner Image");
  } else {
    $(".homecook_profile_banner_area").css("background-color", "#E57373");
  }
});

Template.homecook_profile_banner.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  checkUpload() {
    var checkupload = profile_images.findOne({userId: Meteor.userId(),meta:{purpose: "homecook_banner_picture"}});
    if (checkupload) {
      return true;
    }
  },
  load_banner: function() {
    banner_url = "/profile_upload/" + this._id + this.extensionWithDot;
    $(".homecook_profile_banner_area").css("background-color","");
    $(".homecook_profile_banner_area").css("background-image", "url("+ banner_url +")");
  }
});

Template.homecook_profile_banner.events({
  'change #homecook_banner_file_input': function(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const upload = profile_images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta:{
          purpose: "homecook_banner_picture"
        }
      }, false);

      Meteor.call('profile_images.remove',"homecook_banner_picture");

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, profile_images) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          Meteor.setTimeout(function(){
            var banner_url = "/profile_upload/" + profile_images._id + profile_images.extensionWithDot;
            $(".homecook_profile_banner_area").css("background-color","");
            $(".homecook_profile_banner_area").css("background-image", "url("+ banner_url +")");
          },100);
        }
        Meteor._reload.onMigrate(function () {
          return [false];
        });
        template.currentUpload.set(false);
      });
      upload.start();
    }
  }
});

Template.upload_homecook_profile.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.upload_homecook_profile.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },

  checkUpload: function() {
    var check_profile_picture = profile_images.findOne({
      "userId": Meteor.userId(),
      "meta": {"purpose": "homecook_profile_picture"}
    });
    if (check_profile_picture){
      return true;
    }
  },

  load_profile: function() {
    var profile_id_location = profile_images.findOne({"userId": Meteor.userId(),"meta":{"purpose": "homecook_profile_picture"}});
    profile_url = "/profile_upload/" + profile_id_location._id + profile_id_location.extensionWithDot;
    return profile_url;
  }
});

Template.upload_homecook_profile.events({
  'change #homecook_file_input'(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const upload = profile_images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta:{
          purpose: "homecook_profile_picture"
        }
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, profile_images) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          Meteor.setTimeout(function(){
            var profile_url = "/profile_upload/" + profile_images._id + profile_images.extensionWithDot;
            $(".profile_upload_wrapper").css("background-image", "url("+ profile_url +")");
          },3000);
        }
        /** above is the line that prevents meteor from reloading **/
        Meteor._reload.onMigrate(function () {
          return [false];
        });
        template.currentUpload.set(false);
      });
      upload.start();
    }
  }
});


Template.create_foodie_profile.events({
  'click #create_foodie_button': function(event, template){

      event.preventDefault();


/**      if( isNotEmpty(kitchen_name)           &&
          isNotEmpty(profile_keywords)       &&
          isNotEmpty(last_name)              &&
          isNotEmpty(first_name)             &&
          isNotEmpty(date_of_birth)          &&
          isNotEmpty(gender)                 &&
          isNotEmpty(about_myself)           &&
          isNotEmpty(address_name_1)         &&
          isNotEmpty(address_details_1)      &&
          isNotEmpty(mobile_no_1)            &&
          isNotEmpty(address_name_2)         &&
          isNotEmpty(address_details_2)      &&
          isNotEmpty(mobile_no_2)            &&
          isNotEmpty(card_number)            &&
          isNotEmpty(card_fullname)          &&
          isNotEmpty(card_exp_month)         &&
          isNotEmpty(card_exp_year)          &&
          isNotEmpty(cvv_code)               &&
          isNotEmpty(bank_fullname)          &&
          isNotEmpty(bank_name)              &&
          isNotEmpty(bank_account_no)           )**/

          {




    //divert to the profile page
    $('#create_homecook_button').click();

      }
    /**  else{

      return false;
    } **/
  }
  });

//Kitchen Database
  Template.create_homecook_profile.events({
    'click #create_homecook_button': function(event, template){
      console.log("HOMECOOK_CLICKED")

      event.preventDefault();


      const foodie_name = $('#foodie_name').val();
      const first_name = $('#first_name').val();
      const last_name = $('#last_name').val();
      const mobile = $('#mobile').val();
      const profile_keywords = $('#profile_keywords').val();
      const date_of_birth = $('#date_of_birth').val();
      const gender =  $("input[name='gender']:checked"). val();
      const about_myself = $('#about_myself').val();
      const home_address = $('#home_address').val();
      const office_address = $('#office_address').val();
      const allergy_tags = Session.get('allergy_tags');
      const dietary_tags = Session.get('dietary_tags');
      const card_number = $('#card_number').val();
      const card_fullname = $('#card_fullname').val();
      const card_exp_month = $('#card_exp_month').val();
      const card_exp_year = $('#card_exp_year').val();
      const cvv_code = $('#cvv_code').val();

      const kitchen_name = $('#kitchen_name').val();
      const chef_name = $('#chef_name').val();
      const homecook_profile_keywords = $('#homecook_profile_keywords').val();
      const kitchen_address = $('#kitchen_address').val();
      const about_homecook_myself = $('#about_homecook_myself').val();
      const bank_fullname = $('#bank_fullname').val();
      const bank_account_no = $('#bank_account_no').val();
      const bank_name = $('#bank_name').val();
      const user_id = Meteor.userId();

  /**      if( isNotEmpty(kitchen_name)           &&
            isNotEmpty(profile_keywords)       &&
            isNotEmpty(last_name)              &&
            isNotEmpty(first_name)             &&
            isNotEmpty(date_of_birth)          &&
            isNotEmpty(gender)                 &&
            isNotEmpty(about_myself)           &&
            isNotEmpty(address_name_1)         &&
            isNotEmpty(address_details_1)      &&
            isNotEmpty(mobile_no_1)            &&
            isNotEmpty(address_name_2)         &&
            isNotEmpty(address_details_2)      &&
            isNotEmpty(mobile_no_2)            &&
            isNotEmpty(card_number)            &&
            isNotEmpty(card_fullname)          &&
            isNotEmpty(card_exp_month)         &&
            isNotEmpty(card_exp_year)          &&
            isNotEmpty(cvv_code)               &&
            isNotEmpty(bank_fullname)          &&
            isNotEmpty(bank_name)              &&
            isNotEmpty(bank_account_no)           )**/

            {

              Meteor.call('kitchen_details.insert',
              user_id,
              kitchen_name,
              chef_name,
              homecook_profile_keywords,
              kitchen_address,
              about_homecook_myself,
              bank_fullname,
              bank_name,
              bank_account_no
              );

              Meteor.call('profile_details.insert',
              user_id,
              foodie_name,
              first_name,
              last_name,
              mobile,
              profile_keywords,
              date_of_birth,
              gender,
              about_myself,
              home_address,
              office_address,
              allergy_tags,
              dietary_tags,
              card_number,
              card_fullname,
              card_exp_month,
              card_exp_year,
              cvv_code
              );

  Materialize.toast('Profile created!', 4000)
   //divert to the profile page

  /**    Blaze.render(Template.profile_card, document.getElementById('profile'));
      Blaze.remove(Template.instance().view); **/

        }
      /**  else{

        return false;
      } **/

    }
    });

  //Validation rules

  //Trim Helper
  var trimInput = function(value){
    return value.replace(/^\s*|\s*$/g,"");
  }

  var isNotEmpty = function(value){
    if (value && value !== ''){
      return true;
    }
    Bert.alert("Please fill in all fields", "danger", "growl-top-right");
    return false;
  }
  //Email Validation
  isEmail = function(value){
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(filter.test(value)){
      return true;
    }
    Bert.alert("Please use a valid email address","danger","growl-top-right")
    return false;
  }

  //Check Password fields
  isValidPassword=function(password){

  if(password.length <8){
  Bert.alert("Password must be a least 8 charaters", "danger","growl-top-right");
    return false;
  }
    return true;
  };

  //Match Password
  areValidPassword = function(password, cpassword){

    if(!isValidPassword(password)){

  return false;

    }
    if(password !== cpassword){
      Bert.alert("Password do not match","danger","growl-top-right");
      return false;
    }
      return true;
  }


Template.create_foodie_profile.onRendered(function(){


  //activate datepicker
    this.$('.datepicker').pickadate({
    selectMonths: 12, // Creates a dropdown to control month
    selectYears: 150, // Creates a dropdown of 15 years to control year,
    today: 'TODAY',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });

  //activate modal
  this.$('.modal').modal();

  //activate dropdown
  this.$('select').material_select();

  //activate characterCounter
  this.$('input#input_text, textarea#about_myself').characterCounter();

  //activate the selection tabs
  this.$(document).ready(function(){
    $('ul.tabs').tabs();
  });

});

Template.create_homecook_profile.onRendered(function(){

  //activate datepicker
    this.$('.datepicker').pickadate({
    selectMonths: 15, // Creates a dropdown to control month
    selectYears: 150, // Creates a dropdown of 15 years to control year,
    today: 'TODAY',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });

  //activate modal
  this.$('.modal').modal();

  //activate dropdown
  this.$('select').material_select();

  //activate characterCounter
  this.$('input#input_text, textarea#about_myself').characterCounter();

  //activate the selection tabs
  this.$(document).ready(function(){
    $('ul.tabs').tabs();
  });


});

Template.profile_bank_details.helpers ({
  bank_list: [
    { name: '003 - Standard Chartered Bank (Hong Kong)', option: '003 - Standard Chartered Bank (Hong Kong)'},
    { name: '004 - Hongkong and Shanghai Banking Corporation', option: '2'},
    { name: '009 - China Construction Bank (Asia)', option: '3'},
    { name: '012 - Bank of China (Hong Kong)', option: '4'},
    { name: '015 - Bank of East Asia', option: '5'},
    { name: '018 - China CITIC Bank International', option: '6'},
    { name: '020 - Wing Lung Bank', option: '7'},
    { name: '022 - OCBC Wing Hang Bank', option: '8'},
    { name: '024 - Hang Seng Bank', option: '9'},
    { name: '025 - Shanghai Commercial Bank', option: '10'},
    { name: '027 - Bank of Communications', option: '11'},
    { name: '028 - Public Bank (Hong Kong)', option: '12'},
    { name: '038 - Tai Yau Bank', option: '13'},
    { name: '039 - Chiyu Banking Corporation', option: '14'},
    { name: '040 - Dah Sing Bank', option: '15'},
    { name: '041 - Chong Hing Bank', option: '16'},
    { name: '043 - Nanyang Commercial Bank', option: '17'},
    { name: '061 - Tai Sang Bank', option: '18'},
    { name: '072 - Industrial and Commercial Bank of China (Asia)', option: '19'},
    { name: '128 - Fubon Bank (Hong Kong)', option: '20'},
    { name: '250 - CitiBank (Hong Kong)', option: '21'},
  ],
});

Template.profile_payment_details.helpers ({
  month_list:[
    { month: '01', option:'1'},
    { month: '02', option:'2'},
    { month: '03', option:'3'},
    { month: '04', option:'4'},
    { month: '05', option:'5'},
    { month: '06', option:'6'},
    { month: '07', option:'7'},
    { month: '08', option:'8'},
    { month: '09', option:'9'},
    { month: '10', option:'10'},
    { month: '11', option:'11'},
    { month: '12', option:'12'},
  ],

  year_list:[
    { year: '2017', option:'2017'},
    { year: '2018', option:'2018'},
    { year: '2019', option:'2019'},
    { year: '2020', option:'2020'},
    { year: '2021', option:'2021'},
    { year: '2022', option:'2022'},
    { year: '2023', option:'2023'},
    { year: '2024', option:'2024'},
    { year: '2025', option:'2025'},
    { year: '2026', option:'2026'},
    { year: '2027', option:'2027'},
    { year: '2028', option:'2028'},
  ],
});
