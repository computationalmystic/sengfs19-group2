var repos;


$(document).ready(function(){ 
    var initialUrl = "http://augur.osshealth.io:5000/api/unstable/repos";
    
    var repos = $.getJSON(initialUrl);
    $.when(repos).then(function(){
        var tester = JSON.parse(repos.responseText);
//        console.log(tester);
        
//        var realTester = [];
//        
//         for(var x = 0; x < 20; x++){
//            if(tester[x].commits_all_time != null && tester[x].issues_all_time != null){
//                realTester[x] = tester[x];
//            }
//        }
//        
//        console.log(realTester);
        
//        for(var x = 4; x < 5; x++){
////            var responseTime = "http://augur.osshealth.io:5000/api/unstable/repo-groups/" + realTester[x].repo_group_id + "/repos/" + realTester[x].repo_id + "/issues-maintainer-response-duration";
//            
//            var responseTime = "http://augur.osshealth.io:5000/api/unstable/repo-groups/24/repos/" + realTester[x].repo_id + "/issues-maintainer-response-duration";
//            
//            
//            var repos2 = $.getJSON(responseTime);
//            $.when(repos, repos2).then(function(){
//               var tester2 = JSON.parse(repos2.responseText); 
//                
//                console.log(tester2);
//                
//               for(var x = 0; x < 5; x++){
//                   if(tester[x].commits_all_time != null && tester[x].issues_all_time != null){
//                $("#container").append("<div id='testCSS'>" +
//                                       "<div id='bBorder'>" + realTester[x].repo_name + "</div>" +
//                                       "<p>This repo has a total of " + realTester[x].commits_all_time + 
//                                       " commits since it was created.</p>" +
//                                       "</div>");
//            }
//        
//               }    
//                
//            });
//        }
        for(var x = 0; x < 21; x++){
            if(tester[x].commits_all_time != null && tester[x].issues_all_time != null){
                var url = tester[x].url;
                $("#container").append("<div id='testCSS'>" +
                                       "<div id='bBorder'>" + tester[x].repo_name + "</div>" +
                                       "<p>This repo has a total of " + tester[x].commits_all_time + 
                                       " commits since it was created.</p>" +
                                       "</div>");
            }
        }
        
        $("#inform").css('visibility', 'hidden');
//        
//        $("#testCSS").click(function(){
//          console.log("Hello World!"); 
//       });
    });
});

function loadVisible(){
    $("#inform").css('visibility', 'visible');
}