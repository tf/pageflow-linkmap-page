pageflow.linkmapPage.ProcessedFile = pageflow.UploadedFile.extend({
  stages: [
    {
      name: 'processing',
      activeStates: ['processing'],
      finishedStates: ['processed'],
      failedStates: ['processing_failed']
    }
  ],

  readyState: 'processed'
});
