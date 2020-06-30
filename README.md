1. A textarea in a div as \$editorRef;
2. editor = senseEditor.create(editorRef.current!)
   => get coreEditor from legacy_core_editor => return new SenseEditor(coreEditor)
3.

### what in SenseEditor

currentReqRange
parser
autocomplete

### what in CoreEditor

there's a lot event listener in CoreEditor, and the callback should be registered when new SenseEditor

### Issue List

- custom actions
- smart resize => always keep current top line in view
- smart paste => format curl to json automatically
  - match curl paste
  - parse curl paste
- autocomplete
  - not done yet
- highlight current requests
   - not done yet 


- why autocomplete seperate to so many component
  - what's the difference and common