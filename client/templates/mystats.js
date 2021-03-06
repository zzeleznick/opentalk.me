Template.mystats.helpers({
	userMessagesCount:function(){
		return '<h1>' + Session.get('userMessagesCount') + '</h1>' + '<h6>messages</h6>';
	},
	userRoomsCount:function(){
		if(Session.get('userRoomsCount') > 1)
			return '<h1>' + Session.get('userRoomsCount') + '</h1>' + '<h6>chatrooms</h6>';
		return '<h1>' + Session.get('userRoomsCount') + '</h1>' + '<h6>chatroom</h6>';
	},
	userWordsCount:function(){
		return '<h1>' + Session.get('userWordsCount') + '</h1>' + '<h6>words</h6>';
	},
	userCharactersCount:function(){
		return '<h1>' + Session.get('userCharactersCount') + '</h1>' + '<h6>characters</h6>';
	},
	memberSince:function(){
		if(Meteor.user())
			Session.set('memberSince',new Date(Meteor.user().createdAt).toDateString().substring(4));
		return '<h3>' + Session.get('memberSince') + '</h3>' + '<h6>member since</h6>';
	},
});


var userRoomsAlreadyRendered= false;
function renderUserRooms(r){
	if(userRoomsAlreadyRendered && !r)return;
	userRoomsAlreadyRendered=true;
	
	$('.user-room').remove();
	r.forEach(function(entry){
		if(entry.unreadCount)
			$('#append-here').after( $('<li class="user-room"> <a href="/'+entry.roomid+'">'+entry.roomid+' <span class="unreadCount">'+entry.unreadCount+'</span></a></li>') );
		else
			$('#append-here').after( $('<li class="user-room"> <a href="/'+entry.roomid+'">'+entry.roomid+'</a></li>') );
	});
}

Template.mystats.rendered = function(){
	getUserStats();
}

function getUserStats(){
	Meteor.subscribe('userLastSeenInRooms');
	Meteor.call('getUserStats',function(err,result){
		Session.set('userMessagesCount',result.messagesCount);
		Session.set('userRoomsCount',result.roomsCount);
		Session.set('userWordsCount',result.wordsCount);
		Session.set('userCharactersCount',result.charactersCount);
		renderUserRooms(result.roomsOccWithStats);
	});
}