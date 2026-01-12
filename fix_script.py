import re

with open('script.js', 'r') as f:
    content = f.read()

# Fix the variable scope issue and the double .window.
# Change window.window.currentPhase to currentPhase
content = content.replace('window.window.currentPhase', 'currentPhase')
content = content.replace('window.currentPhase', 'currentPhase')

# Ensure currentPhase is defined correctly in global scope
content = re.sub(r'let currentPhase = 0; // 0=Phase0, 1=Phase1', 'let currentPhase = 0;', content)
if 'let currentPhase = 0;' not in content:
    content = "let currentPhase = 0;\n" + content

# Fix startPhase1 to use global currentPhase
content = content.replace('window.startPhase1 = function() { window.window.currentPhase = 1; window.initializeQuizShell(0); };', 
                          'window.startPhase1 = function() { currentPhase = 1; window.initializeQuizShell(0); };')

with open('script.js', 'w') as f:
    f.write(content)
