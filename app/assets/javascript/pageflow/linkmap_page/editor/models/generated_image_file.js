pageflow.linkmapPage.GeneratedImageFile = pageflow.ReusableFile.extend({
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
