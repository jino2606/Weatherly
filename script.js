var cardBody = document.getElementById("searchBar");


// Add an event listener to the input element
searchBar.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let cityName = searchBar.value
        card_group.innerHTML = ''
        // Call your function when Enter is pressed
        search(cityName);
    }
});

function searchButton(event){
    
    event.preventDefault();
    let cityName = searchBar.value
    search(cityName);
    console.log("kksksks");

}

function getTime(){
        
    const clock = new Date()
    let hours = clock.getHours()
    let minutes = clock.getMinutes()
    let secs = clock.getSeconds()
    // let clk_time = document.getElementById("clk_time");
    clk_time.innerHTML = `${hours}:${minutes}:${secs} ${hours>=12?'PM':'AM'}`

    setTimeout(()=>{getTime()}, 1000)
    
}

function sunTime(time){
    const sunriseTimestamp = new Date(time * 1000); 
    let sunriseHours = sunriseTimestamp.getHours();
    const sunriseMinutes = sunriseTimestamp.getMinutes().toString().padStart(2, '0');
    let amPm = 'AM';

    // Adjust AM/PM
    if (sunriseHours >= 12) {
        amPm = 'PM';
        if (sunriseHours > 12) {
            sunriseHours -= 12;
        }
    }

    // Format the sunrise time
    const formattedSunriseTime = `${sunriseHours.toString().padStart(2, '0')}:${sunriseMinutes} ${amPm}`;
    return formattedSunriseTime
}

const search = async(cityName)=>{

    const apiKey = "ba98deab6ce9cd74af9735fb0625c520"

    
    if(cityName){
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        if (response.ok) {
            response.json().then((weather) => {
                console.log(weather);
                const temperature = (weather.main.temp - 273.15);
                const weatherDescription = weather.weather[0].description;

                /* Get Day */

                const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                const currentDate = new Date();
                const dayOfWeek = daysOfWeek[currentDate.getDay()];
                const dayOfMonth = currentDate.getDate().toString().padStart(2, '0');
                const month = months[currentDate.getMonth()];
                const formattedDate = `${dayOfWeek} ${dayOfMonth} ${month}`;
                const placeName = weather.name;
                const sunrise = sunTime(weather.sys.sunrise)
                const sunset = sunTime(weather.sys.sunset)
                const visibility_data = (weather.visibility / 1000);
                const visibility = Number.isInteger(visibility_data)?visibility_data:visibility_data.toFixed(2) /* Ternary operator : if value is decimal limit the values after decimal point to two */
                const feelsLike = (weather.main.feels_like - 273.15);
                const weatherIcon = weather.weather[0].icon;
                const windSpeed = parseFloat(weather.wind.speed).toFixed(1);
                const windGust = parseFloat(weather.wind.gust).toFixed(1);
                const windDirection = weather.wind.deg
                const humidity = weather.main.humidity;
                const pressure = weather.main.pressure;

                var element = document.querySelector(".right_widTemp");
                if (element) {
                    element.innerHTML  = Math.round(temperature) + '<sup class="right_widDeg">&deg;C</sup>';
                }
                
                weather_desc.innerHTML = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
                date_today.innerHTML = formattedDate
                current_place.innerHTML = placeName
                sunrise_time.innerHTML = sunrise
                sunset_time.innerHTML = sunset
                wid_visibility.innerHTML = visibility + '<span class="detail_units">km</span>'
                wid_feelsLike.innerHTML = Math.round(feelsLike) + '<sup class="detail_units">&deg;C</sup>'
                weather_img.src = `./assets/images/weather_icons/${weatherIcon}.png`
                wind_speed.innerHTML = windSpeed + '<span class="detail_units">km\h</span>' 
                wind_gust.innerHTML = windGust + '<span class="detail_units">km\h</span>' 
                weath_humid.innerHTML = humidity + '<span class="detail_units">%</span>'
                weath_pressure.innerHTML = pressure 
                wind_dir.style.transform = `rotate(${windDirection}deg)`;

                console.log(windDirection);

                /* Weeklly Data */

                let lat = weather.coord.lat;
                let lon = weather.coord.lon;

                const fetchWeeklyData  = async(lat,lon)=>
                    {
                        try{
                    
                            const weeklyData = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=,hourly,minutely&units=metric&appid=${apiKey}`);
                            weeklyData.json().then((data) =>{
                                daily = data.daily.slice(0, 7);
                                daily.forEach(day =>{

                                    const timestamp = day.dt
                                    const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
                                    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                    const dayIndex = date.getDay();
                                    const abbreviatedDay = daysOfWeek[dayIndex];
                                    const image = day.weather[0].icon
                                    const Weekly_temp = Math.floor(day.temp.max)
                                    card_group.innerHTML += `  <div class="px-0 py-3 text-center rounded-4 g-3 me-3 weekly_card">
                                                                    <p class="weekly_day" id="weekly_day">${abbreviatedDay}</p>
                                                                    <img class="Weekly_img" id="Weekly_img" src="./assets/images/weather_icons/${image}.png" alt="">
                                                                    <p class="Weekly_temp" id="Weekly_temp">${Weekly_temp}<sup class="weekly_widDeg">&deg;C</sup></p>
                                                                </div>
                                                            `
                                })

                            })

                    
                        }
                        catch(err)
                        {   
                    
                            console.log("err :", err);
                    
                        }
                    }   

                fetchWeeklyData (lat,lon);   

            })
        }
        else{
            alert("Enter a valid city name")
        }
    }
    else{
        alert("Enter Country name")
    }

}

getTime()

search("Chennai")

const carousel = document.querySelector(".weekly_grp");

let isDragStart = false, prevPageX, prevScrollLeft;

const dragStart = (e) =>{

    isDragStart = true;
    prevPageX = e.pageX;
    prevScrollLeft = carousel.scrollLeft;

}

const dragging = (e) =>{
    
    if(!isDragStart) return;
    e.preventDefault()
    let positionDiff = e.pageX - prevPageX
    carousel.scrollLeft = prevScrollLeft - positionDiff

}

const dragStop = (e) =>{

    isDragStart = false;

}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", dragStop);


