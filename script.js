document.getElementById('country-form').addEventListener('submit', fetchcountryinfo);

async function fetchcountryinfo(event) {
    event.preventDefault(); // Prevent the form from submitting

    const countryname = document.getElementById('country-input').value.trim();
    const countryinfosection = document.getElementById('country-info');
    const borderingcountrysection = document.getElementById('bordering-countries');

    if (!countryname) {
        alert("Please enter a valid country name");
        return;
    }

    borderingcountrysection.innerHTML = '<h2>Bordering Countries</h2>';
    countryinfosection.querySelector('#country-details').innerHTML = '';

    const url = `https://restcountries.com/v3.1/name/${countryname}?fields=name,capital,population,region,flags,borders`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Country not found');
        }
        const json = await response.json();
        const country = json[0];

        // Display country information
        countryinfosection.querySelector('#country-details').innerHTML = `
            <strong>Name:</strong> ${country.name.common}<br>
            <strong>Capital:</strong> ${country.capital[0]}<br>
            <strong>Population:</strong> ${country.population}<br>
            <strong>Region:</strong> ${country.region}<br>
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100">
        `;

        // Check if the country has borders
        if (country.borders && country.borders.length > 0) {
            for (const border of country.borders) {
                console.log(`Fetching border country with code: ${border}`); // Debugging line
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${border}?fields=name,flags`);
                const borderData = await borderResponse.json();

                // Check if borderData is valid
                if (borderData && borderData.length > 0) {
                    borderingcountrysection.innerHTML += `
                        <p><strong>${borderData[0].name.common}</strong></p>
                        <img src="${borderData[0].flags.png}" alt="Flag of ${borderData[0].name.common}" width="50">
                    `;
                } else {
                    borderingcountrysection.innerHTML += `<p>Border countries: ${border}</p>`;
                }
            }
        } else {
            borderingcountrysection.innerHTML += `<p>Country ${country.name.common} does not have bordering countries.</p>`;
        }
    } catch (error) {
        console.error(error.message);
        countryinfosection.querySelector('#country-details').innerHTML = `<p>Error: ${error.message}</p>`;
        borderingcountrysection.innerHTML = '';
    }
}