/* ============================================================
   Sn Hub - Main JS
   Interactive Features, CLI Terminal, Dark Mode, & Lofi Player
   ============================================================ */
(function () {
    'use strict';

    // ---------- Dark / Light Mode Switcher ----------
    var themeToggleBtn = document.getElementById('themeToggle');
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('snhub_theme', theme); } catch (e) {}
    }
    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme') || 'light';
        var next = (current === 'dark') ? 'light' : 'dark';
        setTheme(next);
    }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // ---------- Live Discord Status (Widget API) ----------
    var discordLiveStatus = document.getElementById('discordLiveStatus');
    var discordMemberCount = document.getElementById('discordMemberCount');
    var discordInviteCode = '8KF3BHPZVg';

    function fetchDiscordStatus() {
        fetch('https://discord.com/api/v9/invites/' + discordInviteCode + '?with_counts=true')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data && data.approximate_presence_count !== undefined) {
                    var online = data.approximate_presence_count;
                    var total = data.approximate_member_count;
                    if (discordLiveStatus) {
                        discordLiveStatus.textContent = online + ' membres en ligne sur Discord';
                    }
                    if (discordMemberCount) {
                        discordMemberCount.setAttribute('data-count', total);
                        discordMemberCount.textContent = total + '+';
                    }
                } else if (discordLiveStatus) {
                    discordLiveStatus.textContent = 'Communauté active en ligne';
                }
            })
            .catch(function () {
                if (discordLiveStatus) {
                    discordLiveStatus.textContent = 'Communauté active sur Discord';
                }
            });
    }
    fetchDiscordStatus();

    // ---------- Mobile Nav Toggle ----------
    var navToggle = document.getElementById('navToggle');
    var mainNav = document.getElementById('mainNav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            mainNav.classList.toggle('open');
            navToggle.classList.toggle('active');
        });
        mainNav.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                mainNav.classList.remove('open');
                navToggle.classList.remove('active');
            }
        });
    }

    // ---------- Interactive Terminal Sn CLI ----------
    var cliOutput = document.getElementById('cliOutput');
    var cliInput = document.getElementById('cliInput');
    var cliSubmitBtn = document.getElementById('cliSubmitBtn');
    var cliClearBtn = document.getElementById('cliClearBtn');
    var cliChips = document.querySelectorAll('.cli-chip');

    var cliCommands = {
        help: function () {
            return [
                '<span class="t-cyan">Commandes disponibles sur Sn Hub CLI :</span>',
                '  <span class="t-green">drops</span>    : Voir les derniers logiciels et outils ajoutés',
                '  <span class="t-green">aaron</span>    : Lire le manifeste et l\'hommage à Aaron Swartz',
                '  <span class="t-green">stats</span>    : Afficher les métriques d\'impact du hub',
                '  <span class="t-green">synnox</span>   : Informations sur le fondateur et site perso',
                '  <span class="t-green">discord</span>  : Obtenir le lien d\'invitation officiel',
                '  <span class="t-green">theme</span>    : Basculer entre le mode clair et le mode sombre',
                '  <span class="t-green">clear</span>    : Nettoyer la console'
            ];
        },
        drops: function () {
            return [
                '<span class="t-yellow">⚡ Derniers Drops Vérifiés sur Sn Hub :</span>',
                '  1. <span class="t-blue">[Logiciel]</span> Wallpaper Engine (Débloqué, Steam Free)',
                '  2. <span class="t-blue">[Logiciel]</span> Activateur Windows Permanent (HWID / Digital)',
                '  3. <span class="t-blue">[Outil]</span>    Optimiseur PC & Boost FPS Gaming (Clean)',
                '  4. <span class="t-blue">[Guide]</span>    Guide Dev & Sécurité Anti-Virus Sandbox',
                '  5. <span class="t-blue">[BDD]</span>      Compilation d\'adresses & Datasets publics',
                '  6. <span class="t-blue">[Script]</span>   Scraping Web & Automatisation Python',
                '<span class="t-dim">&rarr; Tous les téléchargements sont sur discord.gg/' + discordInviteCode + '</span>'
            ];
        },
        aaron: function () {
            return [
                '<span class="t-yellow">📜 Guerilla Open Access Manifesto — Aaron Swartz (1986-2013) :</span>',
                '  "L\'information est le pouvoir. Mais comme tout pouvoir, certains veulent le garder pour eux-mêmes.',
                '   Le partage n\'est pas immoral, c\'est un impératif moral."',
                '<span class="t-green">&bull; Sn Hub continue son objectif en rendant le savoir 100% libre et gratuit.</span>'
            ];
        },
        stats: function () {
            return [
                '<span class="t-cyan">📊 Métriques d\'impact de la communauté Sn Hub :</span>',
                '  &bull; <span class="t-green">+900 €</span> d\'économies logicielles par membre',
                '  &bull; <span class="t-green">+76 Go</span> de données & bases partagées',
                '  &bull; <span class="t-green">100%</span> de requêtes traitées',
                '  &bull; <span class="t-green">84+</span> ressources vérifiées en ligne'
            ];
        },
        synnox: function () {
            return [
                '<span class="t-cyan">👤 Fondateur : Synnox</span>',
                '  &bull; Rôle : Développeur Web, Python & C++',
                '  &bull; GitHub : <a href="https://github.com/synnox" target="_blank" class="t-blue">https://github.com/synnox</a>',
                '  &bull; Site perso : <a href="https://synnox.github.io/sn/" target="_blank" class="t-blue">https://synnox.github.io/sn/</a>'
            ];
        },
        discord: function () {
            return [
                '<span class="t-green">🚀 Invitation officielle :</span>',
                '  <a href="https://discord.gg/' + discordInviteCode + '" target="_blank" class="t-blue">https://discord.gg/' + discordInviteCode + '</a>',
                '<span class="t-dim">(Rejoins plus de 280 membres pour télécharger gratuitement)</span>'
            ];
        },
        theme: function () {
            toggleTheme();
            var mode = document.documentElement.getAttribute('data-theme');
            return ['<span class="t-green">&bull; Thème basculé en mode ' + mode + '.</span>'];
        },
        clear: function () {
            return '__CLEAR__';
        }
    };

    function executeCliCommand(cmd) {
        if (!cliOutput) return;
        var cleanCmd = cmd.trim().toLowerCase();
        if (!cleanCmd) return;

        var cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = '<span class="t-green">guest@snhub:~$</span> <span class="t-cmd">' + escapeHtml(cmd) + '</span>';
        cliOutput.appendChild(cmdLine);

        if (cliCommands[cleanCmd]) {
            var result = cliCommands[cleanCmd]();
            if (result === '__CLEAR__') {
                cliOutput.innerHTML = '';
                return;
            }
            result.forEach(function (line) {
                var resLine = document.createElement('div');
                resLine.className = 'terminal-line';
                resLine.innerHTML = line;
                cliOutput.appendChild(resLine);
            });
        } else {
            var errLine = document.createElement('div');
            errLine.className = 'terminal-line';
            errLine.innerHTML = '<span class="t-dim">Commande inconnue: "' + escapeHtml(cleanCmd) + '". Tape <span class="t-green">help</span> pour la liste.</span>';
            cliOutput.appendChild(errLine);
        }

        cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    if (cliInput) {
        cliInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                executeCliCommand(cliInput.value);
                cliInput.value = '';
            }
        });
    }

    if (cliSubmitBtn && cliInput) {
        cliSubmitBtn.addEventListener('click', function () {
            executeCliCommand(cliInput.value);
            cliInput.value = '';
        });
    }

    if (cliClearBtn && cliOutput) {
        cliClearBtn.addEventListener('click', function () {
            cliOutput.innerHTML = '<div class="terminal-line"><span class="t-green">Sn Hub CLI</span> — Console réinitialisée. Tape <span class="t-green">help</span>.</div>';
        });
    }

    cliChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            var cmd = chip.getAttribute('data-cmd');
            if (cmd) {
                executeCliCommand(cmd);
                if (cliInput) cliInput.value = '';
            }
        });
    });

    // ---------- FAQ Accordion ----------
    document.querySelectorAll('.faq-item').forEach(function (item) {
        var question = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        question.addEventListener('click', function () {
            var isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item.active').forEach(function (other) {
                other.classList.remove('active');
                var otherAns = other.querySelector('.faq-answer');
                if (otherAns) otherAns.style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ---------- Interactive Catalog Filter & Search (services.php) ----------
    var searchInput = document.getElementById('catalogSearch');
    var filterButtons = document.querySelectorAll('#categoryFilters .filter-tag');
    var catalogItems = document.querySelectorAll('.catalog-item');
    var catalogCounter = document.getElementById('catalogCounter');
    var noResultsMsg = document.getElementById('noResultsMessage');

    if (catalogItems.length > 0) {
        var activeCategory = 'all';
        var searchQuery = '';

        function updateCatalogView() {
            var visibleCount = 0;

            catalogItems.forEach(function (item) {
                var itemCat = item.getAttribute('data-category') || '';
                var itemName = (item.getAttribute('data-name') || '').toLowerCase();
                var itemText = item.textContent.toLowerCase();

                var matchCategory = (activeCategory === 'all') || (itemCat === activeCategory);
                var matchSearch = (searchQuery === '') || itemName.indexOf(searchQuery) !== -1 || itemText.indexOf(searchQuery) !== -1;

                if (matchCategory && matchSearch) {
                    item.style.display = '';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });

            if (catalogCounter) {
                catalogCounter.innerHTML = 'Affichage de <strong>' + visibleCount + '</strong> ressource' + (visibleCount > 1 ? 's' : '') + ' disponible' + (visibleCount > 1 ? 's' : '');
            }

            if (noResultsMsg) {
                noResultsMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
            }
        }

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                searchQuery = searchInput.value.trim().toLowerCase();
                updateCatalogView();
            });
        }

        filterButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterButtons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                activeCategory = btn.getAttribute('data-filter') || 'all';
                updateCatalogView();
            });
        });
    }

    // ---------- Request Modal (Demander une ressource) ----------
    var openModalBtn = document.getElementById('openModalBtn');
    var closeModalBtn = document.getElementById('closeModalBtn');
    var requestModal = document.getElementById('requestModal');
    var requestForm = document.getElementById('resourceRequestForm');
    var requestStatus = document.getElementById('requestFormStatus');

    if (openModalBtn && requestModal) {
        openModalBtn.addEventListener('click', function () {
            requestModal.style.display = 'flex';
        });
    }

    if (closeModalBtn && requestModal) {
        closeModalBtn.addEventListener('click', function () {
            requestModal.style.display = 'none';
        });
    }

    if (requestModal) {
        requestModal.addEventListener('click', function (e) {
            if (e.target === requestModal) {
                requestModal.style.display = 'none';
            }
        });
    }

    if (requestForm && requestStatus) {
        requestForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var submitBtn = document.getElementById('submitRequestBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi en cours...';
            }

            var formData = new FormData(requestForm);
            fetch(requestForm.getAttribute('action') || 'includes/send-request.php', {
                method: 'POST',
                body: formData
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                requestStatus.style.display = 'block';
                if (data.success) {
                    requestStatus.className = 'form-status success';
                    requestStatus.textContent = data.message || 'Demande envoyée avec succès !';
                    requestForm.reset();
                    setTimeout(function () {
                        if (requestModal) requestModal.style.display = 'none';
                        requestStatus.style.display = 'none';
                    }, 2600);
                } else {
                    requestStatus.className = 'form-status error';
                    requestStatus.textContent = data.message || 'Une erreur est survenue.';
                }
            })
            .catch(function () {
                requestStatus.style.display = 'block';
                requestStatus.className = 'form-status error';
                requestStatus.textContent = 'Erreur de connexion. Rejoins plutôt le Discord pour demander en direct !';
            })
            .finally(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Envoyer la demande';
                }
            });
        });
    }

    // ---------- Lofi Ambient Web Audio Synthesizer Player ----------
    var lofiToggleBtn = document.getElementById('lofiToggleBtn');
    var lofiLabel = document.getElementById('lofiLabel');
    var audioCtx = null;
    var isLofiPlaying = false;
    var lofiNodes = [];

    function startLofiSynth() {
        try {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return false;
            audioCtx = new AudioContext();

            // Master Gain
            var masterGain = audioCtx.createGain();
            masterGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            masterGain.connect(audioCtx.destination);

            // Lowpass filter for warm cozy lofi tone
            var filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(450, audioCtx.currentTime);
            filter.connect(masterGain);

            // Chord frequencies (warm relaxing minor 9th chord: C3, Eb3, G3, Bb3, D4)
            var freqs = [130.81, 155.56, 196.00, 233.08, 293.66];
            freqs.forEach(function (f, idx) {
                var osc = audioCtx.createOscillator();
                osc.type = (idx % 2 === 0) ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(f, audioCtx.currentTime);

                // Subtle LFO vibrato
                var lfo = audioCtx.createOscillator();
                lfo.frequency.setValueAtTime(0.2 + (idx * 0.05), audioCtx.currentTime);
                var lfoGain = audioCtx.createGain();
                lfoGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                lfo.start();

                var noteGain = audioCtx.createGain();
                noteGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                osc.connect(noteGain);
                noteGain.connect(filter);
                osc.start();

                lofiNodes.push(osc, lfo);
            });

            // Vinyl subtle noise generator
            var bufferSize = audioCtx.sampleRate * 2;
            var noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            var output = noiseBuffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * 0.015;
            }
            var whiteNoise = audioCtx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;
            var noiseFilter = audioCtx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(1200, audioCtx.currentTime);
            whiteNoise.connect(noiseFilter);
            noiseFilter.connect(masterGain);
            whiteNoise.start();
            lofiNodes.push(whiteNoise);

            return true;
        } catch (e) {
            return false;
        }
    }

    function stopLofiSynth() {
        if (audioCtx) {
            try { audioCtx.close(); } catch (e) {}
            audioCtx = null;
        }
        lofiNodes = [];
    }

    if (lofiToggleBtn) {
        lofiToggleBtn.addEventListener('click', function () {
            if (!isLofiPlaying) {
                var ok = startLofiSynth();
                if (ok) {
                    isLofiPlaying = true;
                    lofiToggleBtn.classList.add('playing');
                    if (lofiLabel) lofiLabel.textContent = 'Lofi Actif ♫';
                }
            } else {
                stopLofiSynth();
                isLofiPlaying = false;
                lofiToggleBtn.classList.remove('playing');
                if (lofiLabel) lofiLabel.textContent = 'Lofi Ambient';
            }
        });
    }

    // ---------- Animated Counters ----------
    var counters = document.querySelectorAll('[data-count]');
    function animateCount(el) {
        var target = parseFloat(el.getAttribute('data-count'));
        if (isNaN(target)) return;
        var suffix = el.getAttribute('data-suffix') || '';
        var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
        var duration = 1200;
        var start = null;

        function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var val = target * eased;
            el.textContent = val.toFixed(decimals) + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toFixed(decimals) + suffix;
            }
        }
        requestAnimationFrame(step);
    }

    // ---------- Scroll Reveal ----------
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -30px 0px'
        });

        revealEls.forEach(function (el) { io.observe(el); });

        counters.forEach(function (el) {
            var counterIo = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    animateCount(el);
                    counterIo.disconnect();
                }
            }, { threshold: 0.2 });
            counterIo.observe(el);
        });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
        counters.forEach(animateCount);
    }
})();
