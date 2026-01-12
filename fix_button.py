import re

with open('script.js', 'r') as f:
    content = f.read()

# Fix the currentPhase variable and the click listener
# The issue is window.window.currentPhase and incorrect currentPhase initialization
content = content.replace('window.window.currentPhase', 'window.currentPhase')
content = content.replace('window.currentPhase === 0', 'window.currentPhase === 0')
content = content.replace('let currentPhase = 0;', 'window.currentPhase = 0;')

# Ensure currentPhase is set to 0 when starting
content = content.replace("window.initializeQuizShell(0);", "window.currentPhase = 0; window.initializeQuizShell(0);")

with open('script.js', 'w') as f:
    f.write(content)
