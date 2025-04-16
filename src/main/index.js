import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const path = require('path')
const db = require(path.resolve(__dirname, '../../src/main/db.js'))

async function foo(event, data) {
  try {
    console.log(data)
    dialog.showMessageBox({ message: 'message back' })
  } catch (e) {
    dialog.showErrorBox('Ошибка', e)
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  ipcMain.handle('sendSignal', foo)

  ipcMain.handle('get-partners', () => {
    const partners = db.prepare('SELECT * FROM Partners').all()
    const sales = db.prepare(`
      SELECT partner_id, SUM(quantity_sold) as total
      FROM Sales
      GROUP BY partner_id
    `).all()
    ipcMain.handle('add-partner', (event, partner) => {
      const stmt = db.prepare(`
        INSERT INTO Partners (partner_type, partner_name, director_name, email, phone, legal_address, inn, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
    
      stmt.run(
        partner.partner_type,
        partner.partner_name,
        partner.director_name,
        partner.email,
        partner.phone,
        partner.legal_address,
        partner.inn,
        partner.rating
      )
    
      return true
    })
    const salesMap = Object.fromEntries(sales.map(s => [s.partner_id, s.total]))

    return partners
      .map(p => {
        const total = salesMap[p.partner_id] || 0
        let discount = 0
        if (total >= 10000 && total < 50000) discount = 5
        else if (total >= 50000 && total < 300000) discount = 10
        else if (total >= 300000) discount = 15

        return { ...p, discount, totalSold: total }
      })
      .sort((a, b) => b.totalSold - a.totalSold)
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
