module.exports = function () {
    bot.dialog('/displayResultsAll',
        (session, args, next) => {
            if (args.result) {
                var data = args.result;
            } else {
                session.endConversation("Sorry, I couldn't find anything :(");
            }

            var times = [];
            var searchResult = JSON.parse(data.text);
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);

            if(searchResult.length != 0){  
                var lineName = searchResult[0].lineName;
                var destinationName = searchResult[0].destinationName;   

                session.send("Here are the expected arrival times for this busstop:");
                for(var i=0; i<searchResult.length; i++){
                    times[i] = new Date(searchResult[i].expectedArrival);  
                }

                times.sort();

                for(var time in times){
                    var timeNow = new Date();
                    var differenceInMinutes = times[time] - timeNow;
                    var estimatedArrivalMinutes = Math.round(differenceInMinutes / 60000);
                    msg.addAttachment(new builder.HeroCard(session)
                        .title("{0} to {1}".format(searchResult[time].lineName, searchResult[time].destinationName))                   
                        .text("{0}:{1} - [{2}mins]".format( times[time].getHours(), times[time].getMinutes(), estimatedArrivalMinutes))
                    );
                    console.log("{0}:{1}   -----   {2} to {3}".format(times[time].getHours(), times[time].getMinutes(), searchResult[time].lineNam, searchResult[time].destinationName)); 
                }
                session.endConversation(msg);
            }else{
                session.endConversation("Sorry, I couldn't find anything :(");
            }
        }
    );
}

