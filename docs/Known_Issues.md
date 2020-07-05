

# Kown Issues

1. Backend and Frontend webpack watch loops into restart continously after upgrading to `0.5.5`. 
  
  Solution: - Delete `.awcache` and `dist` folders under `servers/backend-server` and `servers/frontend-server` and restart the servers.