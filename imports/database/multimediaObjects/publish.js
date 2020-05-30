import { Meteor } from 'meteor/meteor';
import { ImageSearch, Video, Book } from './collection';

if (Meteor.isServer) {
    Meteor.publish('ImageSearch', function () {
        return ImageSearch.find({});
    });
    Meteor.publish('Book', function(){
        return Book.find({})
    });
    Meteor.publish('Video', function(){
        return Video.find({})
    });
}
