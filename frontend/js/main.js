// JS for dyniamically rendering the songs after being chosen
//will have to actually implement database communication as im just manually
//entering data for it to show

const toggleBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

const songs = [
  { id: 1, title: "Forget Her", artist: "Jeff Buckley" },
  { id: 2, title: "Creep", artist: "Radiohead" },
];

// the rendering of the songs to the actual page (hopefully)
const songList = document.getElementById('song-list');
songs.forEach(song => {
  const div = document.createElement('div');
  div.className = 'song-card';
  div.innerHTML = `<strong>${song.title}</strong><br>${song.artist}`;
  div.addEventListener('click', () => {
    window.location.href = `/song.html?id=${song.id}`;
    //dont think this will work with node
  });
  songList.appendChild(div);
});
