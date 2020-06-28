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
- 