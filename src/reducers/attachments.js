'use strict'

import { GET_ATTACHMENTS_SUCCESS } from '../actions/getAttachments'
import { POST_ATTACHMENT_SUCCESS } from '../actions/postAttachment'
import { DELETE_ATTACHMENT_SUCCESS } from '../actions/deleteAttachment'
import { POST_UPLOAD_URL_FAILURE } from '../actions/postUploadUrl'
import {
  UPLOAD_FILE_REQUEST,
  READ_FILE_SUCCESS,
  getTempId,
  UPLOAD_FILE_FAILURE,
  UPLOAD_FILE_PROGRESS
} from '../actions/uploadFile'
import { merge, mapValues, omit, map } from 'lodash'

export default function attachments(state = [], action) {
  switch(action.type) {
    case GET_ATTACHMENTS_SUCCESS:
    case UPLOAD_FILE_REQUEST:
    case READ_FILE_SUCCESS:
    case UPLOAD_FILE_PROGRESS:
      const isImageAttachments = mapValues(action.attachments, attachment => {
        attachment.isImage = attachment.fileType && attachment.fileType.match('image.*')

        return attachment
      })

      return merge({}, state, isImageAttachments)
    break;

    case POST_ATTACHMENT_SUCCESS:
      const previewAttachments = mapValues(action.attachments, attachment => {
        const tempId = getTempId(attachment)

        if (state[tempId]) {
          attachment.preview = state[tempId].preview
        }

        return attachment
      })

      const tempIds = map(action.attachments, (attachment, key) => {
        return getTempId(attachment)
      })

      const cleanedAttachments = omit(state, tempIds)

      return merge(cleanedAttachments, previewAttachments)
    break;

    case UPLOAD_FILE_FAILURE:
      const errorAttachments = mapValues(action.attachments, attachment => {
        attachment.errors = ['something happened']

        return attachment
      })

      return merge({}, state, errorAttachments)
    break;

    case DELETE_ATTACHMENT_SUCCESS:
      const deleteId = action.attachment.fileId || getTempId(action.attachment)

      return omit(state, [deleteId])
    break;

    default:
      return state
  }
}