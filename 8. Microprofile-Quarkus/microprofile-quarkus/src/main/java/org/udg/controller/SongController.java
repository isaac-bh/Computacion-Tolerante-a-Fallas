package org.udg.controller;

import org.udg.model.Song;
import org.eclipse.microprofile.faulttolerance.*;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.logging.Logger;


@Path("/songs")
public class SongController {
    List<Song> songList = new ArrayList<Song>(){{
        add(new Song("Daylight", "Joji", 2020));
        add(new Song("Say It Right", "Nelly Furtado", 2009));
        add(new Song("Lady", "Modjo", 2000));
        add(new Song("Sky's the Limit", "Notorious B.I.G.", 2006));
        add(new Song("Dancin", "Aaron Smith", 2014));
    }};
    Logger LOGGER = Logger.getLogger("Song Logger");
    
    
    @GET
    @Timeout(value = 3000L)
    @Retry(maxRetries = 3)
    @CircuitBreaker(failureRatio = 0.1, delay = 10000L)
    @Bulkhead(value = 1)
    @Fallback(fallbackMethod = "getSongFallback")
    public List<Song> getSongList() {
        return this.songList;
    }


    @GET
    @Timeout(value = 3000L)
    @Retry(maxRetries = 3)
    @CircuitBreaker(failureRatio = 0.1, delay = 10000L)
    @Bulkhead(value = 0)
    @Fallback(fallbackMethod = "getSongFallback")
    @Path("/random")
    public List<Song> getRandomSong() {
        LOGGER.info("Generando canción aleatoria");
        // unnecesaryFetch();
        Random rand = new Random();
        int num = rand.nextInt(10);
        
        return List.of(this.songList.get(num));
    }

    public List<Song> getSongFallback() {
        LOGGER.warning("Ocurrió un fallo");
        return List.of(new Song("Never Gonna Give You Up", "Rick Astley", 1987));
    }

    public void unnecesaryFetch() {
        try {
            Thread.sleep(5_000L);
        } catch (InterruptedException e) {
            LOGGER.warning("unnecesaryFetch tardó demasiado");
        }
    }
}
