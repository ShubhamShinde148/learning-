document.addEventListener('DOMContentLoaded', () => {
    // Determine which page is loaded
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        initLoginLogic();
    } else if (document.getElementById('terminal-form')) {
        initGitAcademyLogic();
    }
});

/* ==========================================================================
   ENTRANCE PORTAL LOGIN LOGIC
   ========================================================================== */
function initLoginLogic() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggleBtn = document.getElementById('password-toggle');
    const eyeOpenIcon = passwordToggleBtn.querySelector('.eye-open-icon');
    const eyeClosedIcon = passwordToggleBtn.querySelector('.eye-closed-icon');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Toggle Password Visibility
    passwordToggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        
        if (isPassword) {
            eyeOpenIcon.classList.add('hidden');
            eyeClosedIcon.classList.remove('hidden');
            passwordToggleBtn.setAttribute('aria-label', 'Hide password');
        } else {
            eyeOpenIcon.classList.remove('hidden');
            eyeClosedIcon.classList.add('hidden');
            passwordToggleBtn.setAttribute('aria-label', 'Show password');
        }
    });

    // Form Field Real-time Validation
    const validateField = (input, group, validationFn, forceShowError = false) => {
        const isValid = validationFn(input.value);
        if (isValid || (input.value === '' && !forceShowError)) {
            group.classList.remove('invalid');
        } else {
            group.classList.add('invalid');
        }
        return isValid;
    };

    const validateEmail = (value) => emailPattern.test(value.trim());
    const validatePassword = (value) => value.length >= 8;

    // Listeners
    emailInput.addEventListener('input', () => {
        const group = document.getElementById('email-group');
        validateField(emailInput, group, validateEmail);
    });

    emailInput.addEventListener('blur', () => {
        const group = document.getElementById('email-group');
        validateField(emailInput, group, validateEmail, true);
    });

    passwordInput.addEventListener('input', () => {
        const group = document.getElementById('password-group');
        validateField(passwordInput, group, validatePassword);
    });

    passwordInput.addEventListener('blur', () => {
        const group = document.getElementById('password-group');
        validateField(passwordInput, group, validatePassword, true);
    });

    // Submit Action
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailGroup = document.getElementById('email-group');
        const passwordGroup = document.getElementById('password-group');

        const isEmailValid = validateField(emailInput, emailGroup, validateEmail, true);
        const isPasswordValid = validateField(passwordInput, passwordGroup, validatePassword, true);

        if (!isEmailValid || !isPasswordValid) {
            if (!isEmailValid) {
                emailInput.focus();
            } else if (!isPasswordValid) {
                passwordInput.focus();
            }
            showToast('Please correct the validation errors before signing in.', 'error');
            return;
        }

        submitBtn.disabled = true;
        btnText.textContent = 'Authenticating...';
        btnLoader.classList.remove('hidden');

        setTimeout(() => {
            if (emailInput.value.trim() === 'demo@example.com' && passwordInput.value === 'password123') {
                sessionStorage.setItem('userEmail', emailInput.value);
                showToast('Successfully signed in! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showToast('Incorrect credentials. Try demo@example.com / password123', 'error');
                submitBtn.disabled = false;
                btnText.textContent = 'Sign In';
                btnLoader.classList.add('hidden');
                passwordGroup.classList.add('invalid');
                passwordInput.focus();
            }
        }, 1500);
    });

    let toastTimeout;
    const showToast = (message, type) => {
        clearTimeout(toastTimeout);
        toast.className = 'toast';
        toast.classList.add(type);
        toastMessage.textContent = message;
        toast.offsetHeight; // Reflow
        toast.classList.add('show');
        toast.classList.remove('hidden');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 400);
        }, 4000);
    };
}

/* ==========================================================================
   GIT ACADEMY INTERACTIVE LOGIC
   ========================================================================== */
function initGitAcademyLogic() {
    const email = sessionStorage.getItem('userEmail') || (window.location.protocol === 'file:' ? 'demo@example.com' : null);
    if (!email) {
        window.location.href = 'index.html';
        return;
    }

    // --- Dom Elements ---
    const welcomeTitle = document.getElementById('welcome-title');
    const logoutBtn = document.getElementById('logout-btn');
    const navItems = document.querySelectorAll('.nav-item');
    const panelViews = document.querySelectorAll('.panel-view');
    
    const filesWorking = document.getElementById('files-working');
    const filesStaging = document.getElementById('files-staging');
    const commitsLocal = document.getElementById('commits-local');
    const commitsRemote = document.getElementById('commits-remote');
    
    const terminalInput = document.getElementById('terminal-input');
    const terminalForm = document.getElementById('terminal-form');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');
    
    const lessonList = document.getElementById('lesson-list');
    const readerTitle = document.getElementById('reader-title');
    const readerDiff = document.getElementById('reader-diff');
    const readerTime = document.getElementById('reader-time');
    const readerBody = document.getElementById('reader-body');
    
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    const quizProgress = document.getElementById('quiz-progress');
    const btnNextQuestion = document.getElementById('btn-next-question');
    const quizCardView = document.getElementById('quiz-card-view');
    const quizResultView = document.getElementById('quiz-result-view');
    const quizScoreText = document.getElementById('quiz-score-text');
    const btnResetQuiz = document.getElementById('btn-reset-quiz');
    
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');

    // Set Welcome Username
    const userName = email.split('@')[0];
    welcomeTitle.textContent = `Welcome, ${userName.charAt(0).toUpperCase() + userName.slice(1)}!`;

    // --- Sign Out ---
    logoutBtn.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = 'index.html';
    });

    // --- Sidebar tab navigation ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const targetPanel = item.getAttribute('data-panel');
            panelViews.forEach(view => {
                view.classList.remove('active-panel');
                if (view.id === `panel-${targetPanel}`) {
                    view.classList.add('active-panel');
                }
            });

            // Autofocus terminal if simulator active
            if (targetPanel === 'simulator') {
                setTimeout(() => terminalInput.focus(), 100);
            }
        });
    });

    /* ==========================================================
       GIT SIMULATION DATABASE STATE
       ========================================================== */
    const state = {
        gitInitialized: false,
        files: [
            { name: 'README.md', status: 'committed' },
            { name: 'index.html', status: 'untracked' },
            { name: 'style.css', status: 'untracked' },
            { name: 'script.js', status: 'untracked' }
        ],
        localCommits: [
            { hash: 'e0e5300', msg: 'login error solve', files: ['README.md'] }
        ],
        remoteCommits: [
            { hash: 'e0e5300', msg: 'login error solve', files: ['README.md'] }
        ],
        reflog: [
            'e0e5300 HEAD@{0}: commit (initial): login error solve'
        ]
    };

    // --- Render visual areas ---
    const renderVisuals = () => {
        // Clear containers
        filesWorking.innerHTML = '';
        filesStaging.innerHTML = '';
        commitsLocal.innerHTML = '';
        commitsRemote.innerHTML = '';

        // Render Working Dir & Staging Area
        if (!state.gitInitialized) {
            // Show all untracked if git not initialized, with a warning
            state.files.forEach(f => {
                const div = document.createElement('div');
                div.className = 'visual-file untracked';
                div.innerHTML = `<span>📄 ${f.name}</span> <span style="font-size:10px;">(untracked)</span>`;
                filesWorking.appendChild(div);
            });
            
            const emptyHint = document.createElement('div');
            emptyHint.style.color = 'var(--text-muted-light)';
            emptyHint.style.fontSize = '12px';
            emptyHint.style.textAlign = 'center';
            emptyHint.style.marginTop = '40px';
            emptyHint.textContent = 'Run "git init" to begin tracking';
            filesStaging.appendChild(emptyHint);
        } else {
            // Show visual .git folder in working directory
            const gitFolder = document.createElement('div');
            gitFolder.className = 'visual-file';
            gitFolder.style.borderColor = 'var(--primary)';
            gitFolder.style.color = '#c084fc';
            gitFolder.innerHTML = '<span>📁 .git</span> <span>(system)</span>';
            filesWorking.appendChild(gitFolder);

            // Populate according to actual state
            state.files.forEach(f => {
                const div = document.createElement('div');
                
                if (f.status === 'untracked') {
                    div.className = 'visual-file untracked';
                    div.innerHTML = `<span>📄 ${f.name}</span> <span style="font-size: 10px;">untracked</span>`;
                    filesWorking.appendChild(div);
                } else if (f.status === 'modified') {
                    div.className = 'visual-file modified';
                    div.innerHTML = `<span>📄 ${f.name}</span> <span style="font-size: 10px;">modified</span>`;
                    filesWorking.appendChild(div);
                } else if (f.status === 'staged') {
                    div.className = 'visual-file staged';
                    div.innerHTML = `<span>📄 ${f.name}</span> <span style="font-size: 10px;">staged</span>`;
                    filesStaging.appendChild(div);
                }
            });

            // Empty Staging hint
            if (filesStaging.children.length === 0) {
                const hint = document.createElement('div');
                hint.style.color = 'var(--text-muted-light)';
                hint.style.fontSize = '12px';
                hint.style.textAlign = 'center';
                hint.style.marginTop = '40px';
                hint.textContent = 'Staging area empty';
                filesStaging.appendChild(hint);
            }
        }

        // Render Local Repo Commits
        state.localCommits.forEach(c => {
            const div = document.createElement('div');
            div.className = 'visual-commit';
            div.innerHTML = `<span class="hash">[${c.hash}]</span> <span class="msg">${c.msg}</span>`;
            commitsLocal.appendChild(div);
        });

        // Render Remote commits
        state.remoteCommits.forEach(c => {
            const div = document.createElement('div');
            div.className = 'visual-commit remote-commit';
            div.innerHTML = `<span class="hash">[${c.hash}]</span> <span class="msg">${c.msg}</span>`;
            commitsRemote.appendChild(div);
        });
    };

    // Initial render
    renderVisuals();

    /* ==========================================================
       CLI BASH TERMINAL EMULATOR ENGINE
       ========================================================== */
    const writeOutput = (text, isCommand = false) => {
        const line = document.createElement('div');
        line.className = 'cli-line';
        if (isCommand) {
            line.innerHTML = `<span style="color: var(--accent-cyan); font-weight:600;">gitquest@academy:~$</span> <span style="color:#ffffff;">${text}</span>`;
        } else {
            line.textContent = text;
        }
        terminalOutput.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    let toastTimeout;
    const showToast = (message) => {
        clearTimeout(toastTimeout);
        toastText.textContent = message;
        toast.classList.add('show');
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // Command parser
    const executeCommand = (cmdText) => {
        const rawCmd = cmdText.trim();
        writeOutput(rawCmd, true);

        if (rawCmd === '') return;

        const tokens = rawCmd.split(/\s+/);
        const base = tokens[0];

        if (base === 'clear') {
            terminalOutput.innerHTML = '';
            return;
        }

        if (base === 'help') {
            writeOutput(`Available commands:
  git init          Initialize Git version control in current folder.
  git status        Show current status of working tree and staged files.
  git add .         Stage all untracked/modified files.
  git commit -m ""  Record staged changes in the local history.
  git push          Push local commits to GitHub Remote.
  git log           List the commit history chain.
  git reflog        List safety ref logs of all actions.
  git reset --hard  Discard commits/changes and rollback.
  clear             Clear console screen.`);
            return;
        }

        // Git commands parser
        if (base === 'git') {
            const action = tokens[1];
            if (!action) {
                writeOutput("usage: git [--version] [--help] <command> [<args>]");
                return;
            }

            // 1. git init
            if (action === 'init') {
                if (state.gitInitialized) {
                    writeOutput("Reinitialized existing Git repository in C:/Users/shubh/learning/.git/");
                } else {
                    state.gitInitialized = true;
                    // Log in reflog
                    state.reflog.unshift('init: Initialized Git repository');
                    writeOutput("Initialized empty Git repository in C:/Users/shubh/learning/.git/");
                    showToast("Git Initialized! Stage files next.");
                    renderVisuals();
                }
                return;
            }

            // Commands below require git initialized
            if (!state.gitInitialized) {
                writeOutput("fatal: not a git repository (or any of the parent directories): .git");
                return;
            }

            // 2. git status
            if (action === 'status') {
                const untracked = state.files.filter(f => f.status === 'untracked');
                const modified = state.files.filter(f => f.status === 'modified');
                const staged = state.files.filter(f => f.status === 'staged');

                writeOutput("On branch main");
                
                // Compare local commits to remote commits
                const localCount = state.localCommits.length;
                const remoteCount = state.remoteCommits.length;
                if (localCount > remoteCount) {
                    writeOutput(`Your branch is ahead of 'origin/main' by ${localCount - remoteCount} commit(s).\n  (use "git push" to publish your local commits)`);
                } else {
                    writeOutput("Your branch is up to date with 'origin/main'.");
                }
                writeOutput("");

                if (staged.length > 0) {
                    writeOutput("Changes to be committed:\n  (use \"git rm --cached <file>...\" to unstage)\n");
                    staged.forEach(f => {
                        writeOutput(`\tnew file:   ${f.name}`, false);
                    });
                    writeOutput("");
                }

                if (untracked.length > 0) {
                    writeOutput("Untracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n");
                    untracked.forEach(f => {
                        writeOutput(`\t${f.name}`, false);
                    });
                    writeOutput("\nnothing added to commit but untracked files present (use \"git add\" to track)");
                } else if (staged.length === 0) {
                    writeOutput("nothing to commit, working tree clean");
                }
                return;
            }

            // 3. git add
            if (action === 'add') {
                const target = tokens[2];
                if (!target) {
                    writeOutput("Nothing specified, nothing added.\nMaybe you wanted to say 'git add .'?");
                    return;
                }

                if (target === '.' || target === '*') {
                    let count = 0;
                    state.files = state.files.map(f => {
                        if (f.status === 'untracked' || f.status === 'modified') {
                            count++;
                            return { ...f, status: 'staged' };
                        }
                        return f;
                    });
                    if (count > 0) {
                        writeOutput(`Staged ${count} file(s). Ready to commit.`);
                        showToast("Files staged successfully! Commit them now.");
                    } else {
                        writeOutput("All files are already up-to-date and staged.");
                    }
                } else {
                    const file = state.files.find(f => f.name === target);
                    if (file) {
                        if (file.status === 'untracked' || file.status === 'modified') {
                            file.status = 'staged';
                            writeOutput(`Staged file: ${target}`);
                            showToast(`Staged ${target}`);
                        } else {
                            writeOutput(`File ${target} is already staged.`);
                        }
                    } else {
                        writeOutput(`fatal: pathspec '${target}' did not match any files`);
                    }
                }
                renderVisuals();
                return;
            }

            // 4. git commit
            if (action === 'commit') {
                const flag = tokens[2];
                const msgArg = tokens.slice(3).join(' ');

                if (flag !== '-m' || !msgArg) {
                    writeOutput("error: switch `m' requires a value\nUsage: git commit -m \"your commit message\"");
                    return;
                }

                const staged = state.files.filter(f => f.status === 'staged');
                if (staged.length === 0) {
                    writeOutput("On branch main\nnothing to commit, working tree clean");
                    return;
                }

                // Strip quotes from commit message
                const cleanMsg = msgArg.replace(/['"]/g, '');
                const hash = Math.random().toString(16).substr(2, 7);

                // Add Commit
                state.localCommits.unshift({
                    hash: hash,
                    msg: cleanMsg,
                    files: staged.map(f => f.name)
                });

                // Clear staged files state
                state.files = state.files.map(f => {
                    if (f.status === 'staged') {
                        return { ...f, status: 'committed' };
                    }
                    return f;
                });

                // Add to reflog
                state.reflog.unshift(`${hash} HEAD@{0}: commit: ${cleanMsg}`);

                writeOutput(`[main ${hash}] ${cleanMsg}\n ${staged.length} file(s) changed, staged files recorded.`);
                showToast("Commited! Push to GitHub remote to finish.");
                renderVisuals();
                return;
            }

            // 5. git push
            if (action === 'push') {
                const unpushedCommits = state.localCommits.filter(
                    lc => !state.remoteCommits.some(rc => rc.hash === lc.hash)
                );

                if (unpushedCommits.length === 0) {
                    writeOutput("Everything up-to-date");
                    return;
                }

                writeOutput("Enumerating objects: 6, done.\nCounting objects: 100% (6/6), done.");
                writeOutput("Delta compression using up to 12 threads\nCompressing objects: 100% (4/4), done.");
                writeOutput("Writing objects: 100% (4/4), 3.52 KiB | 3.52 MiB/s, done.");
                writeOutput("Total 4 (delta 1), reused 0 (delta 0), pack-reused 0");
                writeOutput("To https://github.com/ShubhamShinde148/learning-.git");

                // Sync remote repository state
                state.remoteCommits = [...state.localCommits];
                const latestHash = state.localCommits[0].hash;
                writeOutput(`   e0e5300..${latestHash}  main -> main`);
                
                showToast("Pushed successfully to GitHub remote!");
                renderVisuals();
                return;
            }

            // 6. git log
            if (action === 'log') {
                state.localCommits.forEach(c => {
                    writeOutput(`commit ${c.hash}7fef292ed70b992aaec3cb837b7d03a\nAuthor: Student Developer <student@academy.org>\nDate:   Mon Jul 13 23:59:02 2026 +0530\n\n    ${c.msg}\n`);
                });
                return;
            }

            // 7. git reflog
            if (action === 'reflog') {
                state.reflog.forEach(log => {
                    writeOutput(log);
                });
                return;
            }

            // 8. git reset
            if (action === 'reset') {
                const flag = tokens[2];
                const targetHash = tokens[3];

                if (flag !== '--hard' || !targetHash) {
                    writeOutput("Usage: git reset --hard <commit-hash>");
                    return;
                }

                const commitIdx = state.localCommits.findIndex(c => c.hash === targetHash);
                if (commitIdx === -1) {
                    writeOutput(`fatal: Cannot resolve '${targetHash}' as a valid commit`);
                    return;
                }

                // Hard Reset state
                state.localCommits = state.localCommits.slice(commitIdx);
                
                // Reset files status back to untracked if they weren't in the commit
                const preservedFiles = [];
                state.localCommits.forEach(c => {
                    c.files.forEach(f => {
                        if (!preservedFiles.includes(f)) preservedFiles.push(f);
                    });
                });

                state.files = state.files.map(f => {
                    if (preservedFiles.includes(f.name)) {
                        return { ...f, status: 'committed' };
                    }
                    return { ...f, status: 'untracked' };
                });

                state.reflog.unshift(`${targetHash} HEAD@{0}: reset: moving to ${targetHash}`);

                writeOutput(`HEAD is now at ${targetHash} ${state.localCommits[0].msg}`);
                showToast(`Reset to commit ${targetHash}`);
                renderVisuals();
                return;
            }

            // Invalid git subcommands
            writeOutput(`git: '${action}' is not a git command. See 'git --help'.`);
            return;
        }

        // Invalid base command
        writeOutput(`bash: command not found: ${base}`);
    };

    // Terminal Submit listener
    terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = terminalInput.value;
        terminalInput.value = '';
        executeCommand(cmd);
    });

    /* ==========================================================
       ACADEMY TUTORIALS MODULE DATA
       ========================================================== */
    const tutorials = [
        {
            id: 'l1',
            title: '1. Introduction to Git & "git init"',
            difficulty: 'Beginner',
            diffClass: 'beg',
            time: '5 mins',
            body: `
                <h4>What is Version Control?</h4>
                <p>Version Control Systems (VCS) track adjustments made to files over time. It allows you to check what changed, revert files back to previous states, and collaborate on a project without overwriting each other's work.</p>
                
                <h4>The Staging Architecture</h4>
                <p>Git uses a unique <strong>three-tier architecture</strong> locally:</p>
                <ol>
                    <li><strong>Working Directory:</strong> The local files you are editing directly.</li>
                    <li><strong>Staging Area (Index):</strong> A staging ground where you prepare files for the next commit.</li>
                    <li><strong>Local Repository (.git):</strong> The committed local database containing your project's historical chain.</li>
                </ol>

                <h4>Initializing Git</h4>
                <p>To begin version control in any folder, initialize it with the following command:</p>
                <pre><code>git init</code></pre>
                
                <div class="try-it-box">
                    <span class="try-it-text">👉 Type <strong>git init</strong> in the simulator terminal to see the hidden <strong>.git</strong> folder appear!</span>
                </div>
            `
        },
        {
            id: 'l2',
            title: '2. Staging & Committing Changes',
            difficulty: 'Beginner',
            diffClass: 'beg',
            time: '8 mins',
            body: `
                <h4>Staging Changes with "git add"</h4>
                <p>Before recording a change, you must add it to the staging area. This allows you to commit only specific changes instead of committing everything at once.</p>
                <pre><code>git add index.html          # Stages index.html only
git add .                   # Stages all changes in the directory</code></pre>

                <h4>Checking Status</h4>
                <p>To view which files are currently untracked, modified, or staged, run:</p>
                <pre><code>git status</code></pre>

                <h4>Saving Changes with "git commit"</h4>
                <p>Committing saves your staged files as a permanent snapshot in your local history database. Always specify a descriptive log message:</p>
                <pre><code>git commit -m "feat: Add core layout structure"</code></pre>
                
                <div class="try-it-box">
                    <span class="try-it-text">👉 Try modifying files, stage them with <strong>git add .</strong>, and commit with a message in the terminal!</span>
                </div>
            `
        },
        {
            id: 'l3',
            title: '3. Connecting to GitHub & "git push"',
            difficulty: 'Intermediate',
            diffClass: 'int',
            time: '10 mins',
            body: `
                <h4>What is a Remote Repository?</h4>
                <p>A remote repository is a version of your project hosted on GitHub, GitLab, or another server. It allows other developers to pull your changes and push their own.</p>
                
                <h4>Linking a Remote</h4>
                <p>To link your local Git database to a new repository on GitHub, run:</p>
                <pre><code>git remote add origin https://github.com/Username/repo.git</code></pre>

                <h4>Uploading to GitHub with "git push"</h4>
                <p>To push your local commits up to the remote repository, run:</p>
                <pre><code>git push origin main</code></pre>

                <div class="try-it-box">
                    <span class="try-it-text">👉 Try running <strong>git push</strong> in the terminal to upload your local commits to the GitHub zone!</span>
                </div>
            `
        },
        {
            id: 'l4',
            title: '4. Undoing commits: "reset" vs "revert"',
            difficulty: 'Advanced',
            diffClass: 'adv',
            time: '12 mins',
            body: `
                <h4>Undoing Changes in Git</h4>
                <p>Git offers two distinct commands for undoing changes, depending on whether you want to clean history or keep audit trails:</p>

                <h4>1. git reset (Rewriting History)</h4>
                <p>Moves the current branch pointer backward in time, discarding later commits. Use this ONLY on local branches that have not been pushed to GitHub.</p>
                <pre><code>git reset --hard &lt;commit-hash&gt;   # Completely discards all changes</code></pre>

                <h4>2. git revert (Safe Undo)</h4>
                <p>Creates a brand-new commit that applies the exact opposite changes of a targeted commit. This is the safest way to undo pushed commits because it doesn't change history.</p>
                <pre><code>git revert &lt;commit-hash&gt;</code></pre>
                
                <div class="try-it-box">
                    <span class="try-it-text">👉 View the commit hashes with <strong>git log</strong>, then try resetting to a previous commit!</span>
                </div>
            `
        },
        {
            id: 'l5',
            title: '5. The Reflog Safety Net',
            difficulty: 'Advanced',
            diffClass: 'adv',
            time: '8 mins',
            body: `
                <h4>What is the Git Reflog?</h4>
                <p>Have you ever run <code>git reset --hard</code> and realized you deleted a commit you actually needed? Don't panic! Git records every single movement of the branch pointer in the <strong>Reference Log (Reflog)</strong>.</p>
                
                <h4>Viewing the Reflog</h4>
                <p>To view your local pointer history, run:</p>
                <pre><code>git reflog</code></pre>
                <p>This will list all commands you executed and their corresponding hashes.</p>

                <h4>Recovering Lost Commits</h4>
                <p>To restore a lost commit found in the reflog, simply hard reset back to its hash:</p>
                <pre><code>git reset --hard &lt;lost-commit-hash&gt;</code></pre>

                <div class="try-it-box">
                    <span class="try-it-text">👉 Try typing <strong>git reflog</strong> to check all actions, including resets, you performed in this session!</span>
                </div>
            `
        }
    ];

    // Populate tutorials list
    tutorials.forEach((t, idx) => {
        const li = document.createElement('li');
        li.className = 'lesson-item';
        if (idx === 0) li.classList.add('active-lesson');
        li.setAttribute('data-id', t.id);
        li.innerHTML = `
            <span>${t.title.split('. ')[1]}</span>
            <span class="badge-difficulty ${t.diffClass}">${t.difficulty}</span>
        `;
        
        li.addEventListener('click', () => {
            document.querySelectorAll('.lesson-item').forEach(el => el.classList.remove('active-lesson'));
            li.classList.add('active-lesson');
            renderLesson(t);
        });

        lessonList.appendChild(li);
    });

    const renderLesson = (lesson) => {
        readerTitle.textContent = lesson.title;
        readerDiff.textContent = lesson.difficulty;
        readerDiff.className = '';
        readerDiff.classList.add('badge-difficulty', lesson.diffClass);
        readerTime.textContent = lesson.time;
        readerBody.innerHTML = lesson.body;
    };

    // Render first lesson default
    renderLesson(tutorials[0]);

    /* ==========================================================
       QUIZ ASSESSMENT COMPONENT ENGINE
       ========================================================== */
    const quizData = [
        {
            question: "Which of the following commands is used to initialize a new local Git repository inside a project folder?",
            options: ["git start", "git init", "git new", "git create"],
            correctIndex: 1,
            explanation: "Excellent! 'git init' creates a hidden .git directory in the root of the folder and starts tracking changes."
        },
        {
            question: "What is the primary purpose of the Git Staging Area?",
            options: [
                "To store files permanently on the GitHub remote server.",
                "To save credentials and prevent repeating sign-ins.",
                "To prepare a structured draft of changes to be recorded in the next commit.",
                "To compress files before pushing them to production."
            ],
            correctIndex: 2,
            explanation: "Correct! The staging area (or index) serves as a drafting space to prepare changes before committing them."
        },
        {
            question: "If you have accidentally deleted a critical commit using 'git reset --hard', how can you locate and recover the lost commit?",
            options: [
                "Using the 'git status' command.",
                "Using the 'git reflog' safety net to locate the commit hash.",
                "It is impossible to recover a commit after reset --hard.",
                "By immediately logging into the GitHub website."
            ],
            correctIndex: 1,
            explanation: "Correct! Git Reflog tracks all movements of the HEAD pointer, allowing you to restore deleted commits easily."
        },
        {
            question: "Which command creates a new commit that applies the opposite changes of a targeted commit, preserving the history timeline?",
            options: ["git reset --hard", "git rollback", "git delete", "git revert"],
            correctIndex: 3,
            explanation: "Perfect! 'git revert' creates a new commit containing opposite edits to cancel changes safely, without rewriting past commits."
        },
        {
            question: "You want to push your local commits on the 'main' branch to a remote repository linked as 'origin'. What is the command?",
            options: ["git upload main", "git push origin main", "git publish main", "git checkout origin main"],
            correctIndex: 1,
            explanation: "Spot on! 'git push origin main' uploads your local commits to the remote branch of origin."
        }
    ];

    let currentQuestionIdx = 0;
    let selectedOptionIdx = -1;
    let quizScore = 0;
    let answerSubmitted = false;

    const renderQuestion = () => {
        const q = quizData[currentQuestionIdx];
        quizProgress.textContent = `Question ${currentQuestionIdx + 1} of ${quizData.length}`;
        quizQuestion.textContent = q.question;
        quizOptions.innerHTML = '';
        quizFeedback.className = 'quiz-feedback';
        quizFeedback.textContent = '';
        selectedOptionIdx = -1;
        answerSubmitted = false;
        btnNextQuestion.textContent = "Submit Answer";

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + idx)}</span> <span class="option-text">${opt}</span>`;
            
            btn.addEventListener('click', () => {
                if (answerSubmitted) return;
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedOptionIdx = idx;
            });

            quizOptions.appendChild(btn);
        });
    };

    btnNextQuestion.addEventListener('click', () => {
        const q = quizData[currentQuestionIdx];

        if (!answerSubmitted) {
            // Submit logic
            if (selectedOptionIdx === -1) {
                alert("Please select an option first!");
                return;
            }

            answerSubmitted = true;
            const optionBtns = quizOptions.querySelectorAll('.option-btn');

            if (selectedOptionIdx === q.correctIndex) {
                optionBtns[selectedOptionIdx].classList.add('correct');
                quizFeedback.className = 'quiz-feedback success show-feedback';
                quizFeedback.textContent = q.explanation;
                quizScore++;
            } else {
                optionBtns[selectedOptionIdx].classList.add('wrong');
                optionBtns[q.correctIndex].classList.add('correct');
                quizFeedback.className = 'quiz-feedback error show-feedback';
                quizFeedback.textContent = `Incorrect. ${q.explanation}`;
            }

            if (currentQuestionIdx < quizData.length - 1) {
                btnNextQuestion.textContent = "Next Question";
            } else {
                btnNextQuestion.textContent = "View Results";
            }
        } else {
            // Next question logic
            if (currentQuestionIdx < quizData.length - 1) {
                currentQuestionIdx++;
                renderQuestion();
            } else {
                // End of quiz
                quizCardView.style.display = 'none';
                quizResultView.style.display = 'block';
                quizScoreText.textContent = `You scored ${quizScore} out of ${quizData.length} (${Math.round((quizScore / quizData.length) * 100)}%).`;
            }
        }
    });

    btnResetQuiz.addEventListener('click', () => {
        currentQuestionIdx = 0;
        quizScore = 0;
        quizCardView.style.display = 'block';
        quizResultView.style.display = 'none';
        renderQuestion();
    });

    // Render first question
    renderQuestion();
}
