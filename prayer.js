//Author: RR & PK
//Refernces: This code was adapted from the Joshua Project API getting started tutorial
//           This code was partially (largely) generated, refactored, and debugged using Anthropic's Claude AI assistant
//              since API calls are a bit harder than the course expected, but what the group wanted to have on the page.

// prayer.js — Unreached People of the Day via Joshua Project API
// API docs: https://api.joshuaproject.net/getting_started
var DOMAIN  = 'https://api.joshuaproject.net';
var API_KEY = 'c23ae4bdcf34';

// -------------------------------------------------------------------
// Fetch the Daily Unreached People Group
// URL structure per the JP docs:
//   https://api.joshuaproject.net/[version]/[resource].[format]?api_key=[key]
// Without a month/day param the API returns TODAY's group by default.
// -------------------------------------------------------------------
async function fetchPrayerData() {
    var container = document.getElementById('prayer-content');

    /* Show an accessible loading state while we wait */
    container.innerHTML = `
        <div class="text-center py-5" role="status" aria-live="polite"
             aria-label="Loading unreached people of the day">
            <div class="spinner-border text-primary" aria-hidden="true"></div>
            <p class="mt-3 text-muted">Connecting to Joshua Project…</p>
        </div>
    `;

    try {
        /* Build the URL exactly as shown in the JP getting-started guide */
        var url = DOMAIN + '/v1/people_groups/daily_unreached.json?api_key=' + API_KEY;

        var response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Server responded with status ' + response.status);
        }

        /* The API returns an array — grab the first (and only) entry, data[0] */
        var data      = await response.json();
        var unreached = data[0];

        if (!unreached || !unreached.PeopNameInCountry) {
            throw new Error('Unexpected response shape from Joshua Project API');
        }

        renderPrayerCard(unreached);

    } catch (error) {
        console.warn('Joshua Project API error — showing fallback:', error);
        showFallback();
    }
}

// -------------------------------------------------------------------
// Fallback shown when the API is unreachable or the key is missing
// -------------------------------------------------------------------
function showFallback() {
    var container = document.getElementById('prayer-content');

    container.innerHTML = `
        <div class="col-lg-10 mx-auto">
            <div class="alert alert-warning" role="alert">
                <strong>Could not reach the Joshua Project API.</strong>
                Make sure you have set a valid <code>API_KEY</code> in
                <code>prayer.js</code>.
                Get a free key at
                <a href="https://api.joshuaproject.net/" target="_blank"
                   rel="noopener noreferrer">api.joshuaproject.net</a>.
            </div>
        </div>
    `;
}

// -------------------------------------------------------------------
// Format helpers (mirroring the JP tutorial's formatting examples)
// -------------------------------------------------------------------

/* Comma-separate a population integer — matches JP tutorial's numberWithCommas() */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* Format PercentEvangelical to 2 decimal places, defaulting null → "0.00%" */
function formatEvangelical(raw) {
    if (raw === null || raw === undefined) return '0.00%';
    return parseFloat(raw).toFixed(2) + '%';
}

// -------------------------------------------------------------------
// Render the card using JP field names from the docs
// -------------------------------------------------------------------
function renderPrayerCard(unreached) {
    var container = document.getElementById('prayer-content');

    /* All field names taken directly from the JP API response spec */
    var name        = unreached['PeopNameInCountry'];
    var country     = unreached['Ctry'];
    var population  = numberWithCommas(unreached['Population']);
    var language    = unreached['PrimaryLanguageName'];
    var religion    = unreached['PrimaryReligion'];
    var evangelical = formatEvangelical(unreached['PercentEvangelical']);
    var photoURL    = unreached['PeopleGroupPhotoURL'];
    var pgURL       = unreached['PeopleGroupURL'];
    var countryURL  = unreached['CountryURL'];
    var scaleText   = unreached['JPScaleText'];
    var scale       = unreached['JPScale'];
    var scaleImgURL = unreached['JPScaleImageURL'];
    var summary     = unreached['Summary'] || 'Please pray for this people group today.';

    container.innerHTML = `
        <div class="row">
            <div class="col-lg-10 mx-auto">

                <article aria-label="Unreached People of the Day: ${name}"
                         class="card shadow border overflow-hidden">
                    <div class="row g-0">

                        <!-- Photo (PeopleGroupPhotoURL from JP API) -->
                        <div class="col-md-5 bg-dark">
                            <a href="${pgURL}" target="_blank" rel="noopener noreferrer"
                               aria-label="View ${name} profile on Joshua Project">
                                <img
                                    src="${photoURL}"
                                    alt="A representative photo of the ${name} people of ${country}"
                                    class="img-fluid h-100 w-100"
                                    style="object-fit:cover; min-height:350px; opacity:0.85;"
                                    loading="lazy"
                                >
                            </a>
                        </div>

                        <!-- Card body -->
                        <div class="col-md-7">
                            <div class="card-body p-4 p-lg-5">

                                <span class="badge rounded-pill mb-2 py-2 px-3"
                                      style="background:#b91c1c; color:#fff;
                                             letter-spacing:.05em; font-size:.7rem;
                                             text-transform:uppercase;">
                                    Unreached People of the Day
                                </span>

                                <!-- Name links to PeopleGroupURL (pg-link / pg-name per JP docs) -->
                                <h1 class="fs-2 fw-bold mb-1">
                                    <a href="${pgURL}" target="_blank" rel="noopener noreferrer"
                                       class="text-decoration-none text-dark pg-link pg-name">
                                        ${name}
                                    </a>
                                </h1>

                                <!-- Country links to CountryURL (country-link / country-name per JP docs) -->
                                <p class="text-muted mb-4 fs-5">
                                    <a href="${countryURL}" target="_blank" rel="noopener noreferrer"
                                       class="text-decoration-none text-muted country-link country-name">
                                        ${country}
                                    </a>
                                </p>

                                <!-- Key facts as a definition list for screen-reader semantics -->
                                <dl class="row mb-4 g-3"
                                    aria-label="Key facts about the ${name}">
                                    <div class="col-6">
                                        <dt class="text-muted small mb-0"
                                            style="letter-spacing:.05em;text-transform:uppercase;font-size:.75rem;">
                                            Population
                                        </dt>
                                        <dd class="fw-medium mb-0 pg-population">${population}</dd>
                                    </div>
                                    <div class="col-6">
                                        <dt class="text-muted small mb-0"
                                            style="letter-spacing:.05em;text-transform:uppercase;font-size:.75rem;">
                                            Language
                                        </dt>
                                        <dd class="fw-medium mb-0 pg-language">${language}</dd>
                                    </div>
                                    <div class="col-6">
                                        <dt class="text-muted small mb-0"
                                            style="letter-spacing:.05em;text-transform:uppercase;font-size:.75rem;">
                                            Religion
                                        </dt>
                                        <dd class="fw-medium mb-0 pg-religion">${religion}</dd>
                                    </div>
                                    <div class="col-6">
                                        <dt class="text-muted small mb-0"
                                            style="letter-spacing:.05em;text-transform:uppercase;font-size:.75rem;">
                                            Evangelical
                                        </dt>
                                        <dd class="fw-medium mb-0 pg-evangelical"
                                            style="color:#b91c1c;">${evangelical}</dd>
                                    </div>
                                </dl>

                                <!-- JP Scale — mirrors the scale/scale-text pattern from JP tutorial -->
                                <p class="small text-muted mb-3">
                                    Status:
                                    <a href="https://joshuaproject.net/definitions.php?term=25"
                                       target="_blank" rel="noopener noreferrer"
                                       class="pg-scale-text text-decoration-none">
                                        ${scaleText}
                                    </a>
                                    (<a href="https://joshuaproject.net/global-progress-scale.php"
                                        target="_blank" rel="noopener noreferrer"
                                        class="pg-scale text-decoration-none">
                                        ${scale}
                                    </a>
                                    <a href="https://joshuaproject.net/global-progress-scale.php"
                                       target="_blank" rel="noopener noreferrer"
                                       id="progress-scale-image"
                                       aria-label="JP Global Progress Scale: ${scaleText}">
                                        <img src="${scaleImgURL}"
                                             alt="Progress scale ${scale}: ${scaleText}"
                                             style="vertical-align:middle; height:16px;">
                                    </a>)
                                </p>

                                <!-- Summary / prayer request (Summary field from JP API) -->
                                <section aria-label="Prayer request"
                                         class="bg-light p-4 rounded border-start border-primary border-4 mb-4">
                                    <h2 class="h6 fw-bold mb-2">Prayer Request</h2>
                                    <p class="small mb-0 text-dark" style="line-height:1.7;">
                                        ${summary}
                                    </p>
                                </section>

                                <!-- Commit button with accessible state -->
                                <div class="d-grid mt-auto">
                                    <button
                                        id="pray-btn"
                                        class="btn btn-primary btn-lg shadow-sm"
                                        aria-pressed="false"
                                        onclick="handlePrayCommit(this, '${name.replace(/'/g, "\\'")}')">
                                        I commit to pray today
                                    </button>
                                </div>

                                <!-- Live region — screen readers announce confirmation -->
                                <div id="pray-confirmation"
                                     role="status"
                                     aria-live="polite"
                                     class="mt-2 text-center small text-success fw-medium">
                                </div>

                            </div>
                        </div>
                    </div>
                </article>

                <p class="text-center mt-4 mb-5 text-muted small">
                    Data provided by the
                    <a href="https://joshuaproject.net" target="_blank"
                       rel="noopener noreferrer" class="text-decoration-none">
                        Joshua Project
                    </a>
                </p>

            </div>
        </div>
    `;
}

function handlePrayCommit(btn, peopleName) {
    btn.setAttribute('aria-pressed', 'true');
    btn.disabled = true;
    btn.textContent = '🙏 Committed to pray!';
    btn.classList.replace('btn-primary', 'btn-success');

    var confirmation = document.getElementById('pray-confirmation');
    if (confirmation) {
        confirmation.textContent =
            'Thank you for committing to pray for the ' + peopleName + ' today!';
    }
}

fetchPrayerData();
