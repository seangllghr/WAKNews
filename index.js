#!/usr/bin/node

const fs = require('fs')
const cheerio = require('cheerio')
const markdown = require('markdown').markdown
const { spawn } = require('child_process')

function getInstallPath() {
  let binPath = fs.realpathSync(process.argv[1])
  return binPath.substring(0, binPath.lastIndexOf('/'))
}

function getIssueDate() {
  const today = new Date()
  let dd = today.getDate() + 1 // Issue is published the day before
  let mm = today.getMonth() + 1 // January is 0
  let yyyy = today.getFullYear()

  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  let issueDate = yyyy + '-' + mm + '-' + dd
  return issueDate
}

// Set file targets and path prefixes
const installPath = getInstallPath()
const stylePath = installPath + '/styles/styles.css'
const featureArticle = process.argv[2]
const comingEvents = process.argv[3]
const issueDate = getIssueDate()
const outputPath = issueDate + '.pdf'

console.log('This is the WakNews Compiler')

// Load skel.html and parse it into a cheerio object
const doc = cheerio.load(fs.readFileSync(installPath + '/skel.html'))

// Load feature article, parse it into an html string, and inject it into the doc
const featureMd = fs.readFileSync(featureArticle).toString()
var featureHtml = markdown.toHTML(featureMd)
featureHtml = featureHtml.replace(/<h1>/g, '<h3>')
featureHtml = featureHtml.replace(/<\/h1>/g, '</h3>')
doc('#feature-article').html(featureHtml)

// Load coming events
const eventsList = JSON.parse(fs.readFileSync(comingEvents))

// Build and inject table rows for each event
eventsList.forEach(function(event) {
  doc('#coming-events').append(
    '<tr class="event">'
    + '<td class="event-info event-title">'
    + event[0]
    + '</td>'
    + '<td class="event-info event-detail">'
    + event[1]
    + '</td>'
    + '</tr>'
  )
})

// Inject issue date into document
doc('.issue-date').html(issueDate)

// Add install-relative image sources
doc('#wakpatch').attr('src', installPath + '/resources/wakpatch.png')
doc('#camping-logo').attr('src', installPath + '/resources/council_camping_logo.png')
doc('#bsa-logo').attr('src', installPath + '/resources/fleur_de_lis_W.png')

// Build the final PDF
fs.writeFileSync('draft.html', doc.html())
const prince = spawn('prince', ['-o', outputPath, '-s', stylePath, 'draft.html'])

prince.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

prince.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`)
})

prince.on('close', (code) => {
  console.log(`Prince exited with code ${code}`)
  fs.unlinkSync('draft.html')
})
