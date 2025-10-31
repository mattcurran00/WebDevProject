// script to validate login when ur clicking onto saved songs
// wouldnt make sense for saved songs to be there if the user 
// isnt logged in. Still  have to figure out the API part and paths 
// will be a mess for the minute
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch("/api/saved-login");
        const data = await res.json();

        if(!data.loggedIn){
            //redirect to login if not logged in

            window.location.href = "../html/login.html";
            return;
        }

        loadSavedSongs();
    } catch (error) {
        console.error("kurwa", error);
        window.location.href = "../html/login.html";
    }
});
