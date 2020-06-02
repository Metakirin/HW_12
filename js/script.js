//----------------------------------------------------------------- Original app ------------------------------------------------------
function fetchData(method, url) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.onload = () => resolve(JSON.parse(xhr.response));
        xhr.onerror = () => reject(xhr.statusText);

        xhr.send();
    })

    return promise;
}

const key = '03fb54ebf904aeecf7fbb0e169f0c7ad';
const urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`;
const urlWeather5 = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`;
const kelvin = 273.15;
const container = document.querySelector('#container');
const sectionNode = document.createElement('section');

// fetchData('GET', urlWeather).then(res => {
//     const data = res;
//     console.log(data);

//     function getRightMinutes(minute) {
//         if (minute < 10) {
//             minute = "0" + minute;
//         }
//         return minute;
//     }

//     function getWindDirection() {
//         if (data.wind.deg <= 45) return "North";
//         if (data.wind.deg <= 135) return "East";
//         if (data.wind.deg <= 270) return "South";
//         if (data.wind.deg <= 315) return "West";
//         if (data.wind.deg <= 360) return "North";
//     }

//     const [city, state, temp, tempFeelsLike, time, windSpeed, icon] = [
//         data.name,
//         data.sys.country,
//         Math.round(data.main.temp - kelvin),
//         Math.round(data.main.feels_like - kelvin),
//         new Date(data.dt * 1000).getHours() + ':' + getRightMinutes(new Date(data.dt * 1000).getMinutes()),
//         data.wind.speed,
//         data.weather[0].icon
//     ]

//     const windDeg = getWindDirection();

//     console.log(city, state, temp, tempFeelsLike, time, windDeg, windSpeed);

//     const template = `
//             <div class="islandHead">
//                 <div class="firstHeadPart">
//                     <p style="padding-left: 15px; padding-top: 10px; margin-bottom: 0rem;">${city}, ${state}</p>
//                     <p style="padding-left: 15px;"><i class="far fa-clock"></i> ${time}</p>
//                     <div class="weatherVidgetMenu">
//                         <img src="http://openweathermap.org/img/wn/${icon}@2x.png" class="mainImg">
//                         <p style="font-size:35px; margin-bottom: 0rem;">${temp} °C</p>
//                         <p style="color: rgba(236, 232, 232, 0.932); font-size:17px; margin-bottom: 0rem;">Feels like ${tempFeelsLike} °C</p>
//                     </div>
//                 </div>

//                 <div class="SecondHeadPart">
//                     <p style="font-size:20px;"><i class="far fa-compass"></i> ${windDeg}</p>
//                     <p style="font-size:20px;"><i class="fas fa-wind"></i> ${windSpeed} m/s</p>
//                 </div>
//             </div>
//     `
//     container.insertAdjacentHTML('beforeend', template);

// }).catch((error) => {
//     console.log(error);
// })



// fetchData('GET', urlWeather5).then(res => {
//     const data2 = res;
//     console.log(data2);
//     const list = data2.list;

//     const listByDays = list.filter((item) => {
//         return item.dt_txt.toLowerCase().trim().includes("12:00:00");
//     });

//     function dtDayForecast(day) {
//         return new Date(day).getDate();
//     }

//     function dtMonthForecast(month) {
//         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//         const monthIndex = new Date(month).getMonth();

//         return months[monthIndex];
//     }

//     listByDays.forEach(item => {
//         const date = dtDayForecast(item.dt_txt) + ' ' + dtMonthForecast(item.dt_txt) + ' 12:00 a.m.';
//         const icon = item.weather[0].icon;
//         const temp = Math.round(item.main.temp - kelvin);

//         const template2 = `
//             <div class="islandMain">
//                 <p style="margin-bottom: 0rem; padding-bottom:15px;">${date}</p>
//                 <img src="http://openweathermap.org/img/wn/${icon}@2x.png">
//                 <p style="margin-bottom: 0rem; padding-bottom:15px;">${temp} °C</p>
//             </div>
//         `
//         sectionNode.innerHTML = sectionNode.innerHTML + template2;
//     })

//     container.append(sectionNode);

// }).catch((error) => {
//     console.error(error)
// })

// ------------------------------------------------------- Rewrite to classes --------------------------------------------------
const arrData = [];
fetchData('GET', urlWeather)
    .then(data => arrData.push(data))
    .then(() => fetchData('GET', urlWeather5))
    .then(data => arrData.push(data))
    .then(res => {
        const weather1 = new Weather(arrData);
        weather1.render();
        weather1.iterateOverDataAndRender();
    })
    .catch((error) => console.log(error))


class Weather {
    constructor(data) {
        [this.data, this.data2] = data;
        this.city = this.data.name;
        this.state = this.data.sys.country;
        this.temp = this._createValueForTemp();
        this.tempFeelsLike = this._createValueForTempFeelsLike();
        this.time = this._createValueForTime();
        this.windDeg = this._createValueForWindDeg();
        this.windSpeed = this.data.wind.speed;
        this.icon = this.data.weather[0].icon;

        this.list = this._copyArray();
        this.listByDays = this._createFilter();
    }

    _getRightMinutes(minute) {
        if (minute < 10) {
            minute = "0" + minute;
        }
        return minute;
    }

    _getWindDirection() {
        if (this.data.wind.deg <= 45) return "North";
        if (this.data.wind.deg <= 135) return "East";
        if (this.data.wind.deg <= 270) return "South";
        if (this.data.wind.deg <= 315) return "West";
        if (this.data.wind.deg <= 360) return "North";
    }

    _createValueForTemp() {
        return Math.round(this.data.main.temp - kelvin);
    }

    _createValueForTempFeelsLike() {
        return Math.round(this.data.main.feels_like - kelvin);
    }

    _createValueForTime() {
        return new Date(this.data.dt * 1000).getHours() + ':' + this._getRightMinutes(new Date(this.data.dt * 1000).getMinutes());
    }

    _createValueForWindDeg() {
        const windDeg = this._getWindDirection();
        return windDeg;
    }

    _copyArray() {
      const list = this.data2.list;
      return list;
    }

    _createFilter() {
        const listByDays = this.list.filter((item) => {
            return item.dt_txt.toLowerCase().trim().includes("12:00:00");
        });
        return listByDays;
    }

    _dtDayForecast(day) {
        return new Date(day).getDate();
    }

    _dtMonthForecast(month) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const monthIndex = new Date(month).getMonth();

        return months[monthIndex];
    }

    render() {
        const template = `
            <div class="islandHead">
                <div class="firstHeadPart">
                    <p style="padding-left: 15px; padding-top: 10px; margin-bottom: 0rem;">${this.city}, ${this.state}</p>
                    <p style="padding-left: 15px;"><i class="far fa-clock"></i> ${this.time}</p>
                    <div class="weatherVidgetMenu">
                        <img src="http://openweathermap.org/img/wn/${this.icon}@2x.png" class="mainImg">
                        <p style="font-size:35px; margin-bottom: 0rem;">${this.temp} °C</p>
                        <p style="color: rgba(236, 232, 232, 0.932); font-size:17px; margin-bottom: 0rem;">Feels like ${this.tempFeelsLike} °C</p>
                    </div>
                </div>

                <div class="SecondHeadPart">
                    <p style="font-size:20px;"><i class="far fa-compass"></i> ${this.windDeg}</p>
                    <p style="font-size:20px;"><i class="fas fa-wind"></i> ${this.windSpeed} m/s</p>
                </div>
            </div>
        `
        container.insertAdjacentHTML('beforeend', template);
    }

    iterateOverDataAndRender() {
        this.listByDays.forEach((item) => {
            const date = this._dtDayForecast(item.dt_txt) + ' ' + this._dtMonthForecast(item.dt_txt) + ' 12:00 a.m.';
            const icon = item.weather[0].icon;
            const temp = Math.round(item.main.temp - kelvin);

            const template2 = `
                <div class="islandMain">
                    <p style="margin-bottom: 0rem; padding-bottom:15px;">${date}</p>
                    <img src="http://openweathermap.org/img/wn/${icon}@2x.png">
                    <p style="margin-bottom: 0rem; padding-bottom:15px;">${temp} °C</p>
                </div>
            `
            sectionNode.innerHTML = sectionNode.innerHTML + template2;
        })

        container.append(sectionNode);
    }
}