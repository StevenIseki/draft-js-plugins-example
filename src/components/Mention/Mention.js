import React, { Component } from 'react'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import mentions from './mentions'

/*
import styles from './Mention.css'
*/

import 'draft-js-mention-plugin/lib/plugin.css'

/* FOR CUSTOM ADD: theme: styles, */
const mentionPlugin = createMentionPlugin({
  mentions,
  entityMutability: 'IMMUTABLE',
  positionSuggestions,
  mentionPrefix: '@',
})

const { MentionSuggestions } = mentionPlugin
const plugins = [mentionPlugin]

const Entry = (props) => {
  const {
    mention,
    theme,
    searchValue,
    ...parentProps
  } = props

  return (
    <div {...parentProps}>
      <div className={theme.mentionSuggestionsEntryContainer}>
        <div className={theme.mentionSuggestionsEntryContainerLeft}>
          <img
            src={mention.get('avatar')}
            className={theme.mentionSuggestionsEntryAvatar}
            role="presentation"
          />
        </div>

        <div className={theme.mentionSuggestionsEntryContainerRight}>
          <div className={theme.mentionSuggestionsEntryText}>
            {mention.get('name')}
          </div>

          <div className={theme.mentionSuggestionsEntryTitle}>
            {mention.get('title')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default class CustomMentionEditor extends Component {

  state = {
    editorState: EditorState.createEmpty(),
    suggestions: mentions,
  }

  onChange = (editorState) => {
    this.setState({ editorState })
  }

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    })
  }

  focus = () => {
    this.editor.focus()
  }

  render() {
    return (
      <div className='editor' onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element; }}
        />
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
          entryComponent={Entry}
        />
      </div>
    )
  }
}

const positionSuggestions = ({ state, props }) => {
  let transform
  let transition

  if (state.isActive && props.suggestions.size > 0) {
    transform = 'scaleY(1)'
    transition = 'all 0.25s cubic-bezier(.3,1.2,.2,1)'
  } else if (state.isActive) {
    transform = 'scaleY(0)'
    transition = 'all 0.25s cubic-bezier(.3,1,.2,1)'
  }

  return {
    transform,
    transition,
  }
}
