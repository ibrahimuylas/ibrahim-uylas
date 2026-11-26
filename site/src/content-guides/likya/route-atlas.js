const regionDetails = {
  west: {
    label: 'Batı Likya',
    description:
      'Bölüm 1–10 için gezinme grubu. Bu sınıflama günlük yürüyüş planı değildir.'
  },
  central: {
    label: 'Orta Likya',
    description:
      'Bölüm 11–18 için gezinme grubu. Ayrıntılı yürüyüş rehberleri hazırlanıyor.'
  },
  east: {
    label: 'Doğu Likya',
    description:
      'Bölüm 19–31 için gezinme grubu. Ayrıntılı yürüyüş rehberleri hazırlanıyor.'
  }
}

const filterRouteSections = (sections, filters = {}) =>
  sections.filter(section => {
    if (filters.region && section.editorialRegion !== filters.region) {
      return false
    }
    if (
      filters.distance === 'verified' &&
      (section.distanceKm?.value === null || !section.distanceKm)
    ) {
      return false
    }
    if (
      filters.search &&
      !`${section.name} ${section.start || ''} ${section.end || ''}`
        .toLocaleLowerCase('tr')
        .includes(filters.search.toLocaleLowerCase('tr'))
    ) {
      return false
    }

    return true
  })

const sectionsByRegion = sections =>
  ['west', 'central', 'east'].map(region => ({
    region,
    ...regionDetails[region],
    sections: sections.filter(section => section.editorialRegion === region)
  }))

const regionBoundary = sections => {
  if (sections.length === 0) return null

  const first = sections[0]
  const last = sections[sections.length - 1]

  return {
    start: first.start || first.officialTitle,
    end: last.end || last.officialTitle
  }
}

module.exports = {
  filterRouteSections,
  regionBoundary,
  regionDetails,
  sectionsByRegion
}
