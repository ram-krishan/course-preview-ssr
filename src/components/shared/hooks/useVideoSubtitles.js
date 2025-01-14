import { pagePreview } from "../../../graphql_states/contentstack";
import { isEmpty, isNil, map } from 'lodash'

const mapSubtitles = (subtitleCmsId, data) => {
  const locales = JSON.parse(process.env.REACT_APP_LOCALE)
  data = data.filter((d) => !isNil(d.subtitles))

  return map(data, ({subtitles, locale}) => ({
    title: subtitles.title,
    id: subtitleCmsId,
    language: locale,
    label: locales[locale],
    url: subtitles.fileConnection.edges[0] && subtitles.fileConnection.edges[0].node.url,
  }))
}

export const useVideoSubTitles = (subtitleCmsId) => {
  const [enUsSubtitleDetails, {
    data: enUsSubtitleData,
    loading: enUsSubtitleloading,
    error: enUsSubtitleError,
  }] = useLazyQuery(
    pagePreview.queries.GET_VIDEO_SUBTITLE,
  );

  const [deDeSubtitleDetails, {
    data: deDeSubtitleData,
    loading: deDeSubtitleloading,
    error: deDeSubtitleError,
  }] = useLazyQuery(
    pagePreview.queries.GET_VIDEO_SUBTITLE,
  );

  const [frFrSubtitleDetails, {
    data: frFrSubtitleData,
    loading: frFrSubtitleloading,
    error: frFrSubtitleError,
  }] = useLazyQuery(
    pagePreview.queries.GET_VIDEO_SUBTITLE,
  );

  const [zhCnSubtitleDetails, {
    data: zhCnSubtitleData,
    loading: zhCnSubtitleloading,
    error: zhCnSubtitleError,
  }] = useLazyQuery(
    pagePreview.queries.GET_VIDEO_SUBTITLE,
  );

  const [ptBrSubtitleDetails, {
    data: ptBrSubtitleData,
    loading: ptBrSubtitleloading,
    error: ptBrSubtitleError,
  }] = useLazyQuery(
    pagePreview.queries.GET_VIDEO_SUBTITLE,
  );

  const [es419SubtitleDetails, {
    data: es419SubtitleData,
    loading: es419Subtitleloading,
    error: es419SubtitleError,
  }] = useLazyQuery(
    pagePreview.queries.GET_VIDEO_SUBTITLE,
  );

  const [itItSubtitleDetails, {
    data: itItSubtitleData,
    loading: itItSubtitleloading,
    error: itItSubtitleError,
  }] = useLazyQuery(
    pagePreview.queries.GET_VIDEO_SUBTITLE,
  );

  const [trTrSubtitleDetails, {
    data: trTrSubtitleData,
    loading: trTrSubtitleloading,
    error: trTrSubtitleError,
  }] = useLazyQuery(
    pagePreview.queries.GET_VIDEO_SUBTITLE,
  );

  const [jaJpSubtitleDetails, {
    data: jaJpSubtitleData,
    loading: jaJpSubtitleloading,
    error: jaJpSubtitleError,
  }] = useLazyQuery(
    pagePreview.queries.GET_VIDEO_SUBTITLE,
  );

  if (!isEmpty(subtitleCmsId)) {
    if (!enUsSubtitleloading && !enUsSubtitleError && !enUsSubtitleData)
      enUsSubtitleDetails({variables: {subtitleCmsId: subtitleCmsId, locale: 'en-us',}})
    if (!deDeSubtitleloading && !deDeSubtitleError && !deDeSubtitleData)
      deDeSubtitleDetails({variables: {subtitleCmsId: subtitleCmsId, locale: 'de-de',}})
    if (!frFrSubtitleloading && !frFrSubtitleError && !frFrSubtitleData)
      frFrSubtitleDetails({variables: {subtitleCmsId: subtitleCmsId, locale: 'fr-fr',}})
    if (!zhCnSubtitleloading && !zhCnSubtitleError && !zhCnSubtitleData)
      zhCnSubtitleDetails({variables: {subtitleCmsId: subtitleCmsId, locale: 'zh-cn',}})
    if (!ptBrSubtitleloading && !ptBrSubtitleError && !ptBrSubtitleData)
      ptBrSubtitleDetails({variables: {subtitleCmsId: subtitleCmsId, locale: 'pt-br',}})
    if (!es419Subtitleloading && !es419SubtitleError && !es419SubtitleData)
      es419SubtitleDetails({variables: {subtitleCmsId: subtitleCmsId, locale: 'es-419',}})
    if (!itItSubtitleloading && !itItSubtitleError && !itItSubtitleData)
      itItSubtitleDetails({variables: {subtitleCmsId: subtitleCmsId, locale: 'it-it',}})
    if (!trTrSubtitleloading && !trTrSubtitleError && !trTrSubtitleData)
      trTrSubtitleDetails({variables: {subtitleCmsId: subtitleCmsId, locale: 'tr-tr',}})
    if (!jaJpSubtitleloading && !jaJpSubtitleError && !jaJpSubtitleData)
      jaJpSubtitleDetails({variables: {subtitleCmsId: subtitleCmsId, locale: 'ja-jp',}})
  }
  const loading = enUsSubtitleloading || deDeSubtitleloading || frFrSubtitleloading || zhCnSubtitleloading || ptBrSubtitleloading || es419Subtitleloading || itItSubtitleloading || trTrSubtitleloading || jaJpSubtitleloading

  const  subtitles = mapSubtitles(subtitleCmsId, [
    {...enUsSubtitleData, locale: 'en-us'},
    {...deDeSubtitleData, locale: 'de-de'},
    {...frFrSubtitleData, locale: 'fr-fr'},
    {...zhCnSubtitleData, locale: 'zh-cn'},
    {...ptBrSubtitleData, locale: 'pt-br'},
    {...es419SubtitleData, locale: 'es-419'},
    {...itItSubtitleData, locale: 'it-it'},
    {...trTrSubtitleData, locale: 'tr-tr'},
    {...jaJpSubtitleData, locale: 'ja-jp'},
  ])
  return {
    subtitles,
    loading,
  }
}
