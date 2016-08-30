//
//  ViewController.m
//  App
//
//  Created by QC on 2/25/16.
//  Copyright © 2016 QC. All rights reserved.
//

#import "ViewController.h"
#import <GCDWebServer/GCDWebServer.h>
@import XWalkView;

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    XWalkView* view = [[XWalkView alloc]initWithFrame:[self.view frame]];
    view.scrollView.bounces = false;
    [self.view addSubview:view];
    
    NSURL* root = [[NSBundle mainBundle].resourceURL URLByAppendingPathComponent:@"www"];
    if (root) {
        NSURL* url = [root URLByAppendingPathComponent:@"StartGame.html"];
        NSError* error;

        NSURLRequest* request = nil;
        if ([url checkResourceIsReachableAndReturnError:&error]) {
            request = [self loadFileWithHttpService:url allowingReadAccessToURL:root];
        }
        
        if (request) {
            [view loadRequest:request];
        }
        else if (error){
            [view loadHTMLString:error.description baseURL:nil];
        }
    }
}

- (NSURLRequest*)loadFileWithHttpService:(NSURL*)URL allowingReadAccessToURL:(NSURL*)readAccessURL {
    // The implementation with embedding HTTP server for cross origin requests.
    if (!URL.fileURL || !readAccessURL.fileURL) {
        NSURL* url = URL.fileURL ? readAccessURL : URL;
        [NSException raise:NSInvalidArgumentException format:@"%@ is not a file URL", url];
    }
    
    NSFileManager* fileManager = [NSFileManager defaultManager];
    NSURLRelationship relationship = NSURLRelationshipOther;
    BOOL isDictionary = NO;
    if (![fileManager fileExistsAtPath:readAccessURL.path isDirectory:&isDictionary] || !isDictionary
        || ![fileManager getRelationship:&relationship ofDirectoryAtURL:readAccessURL toItemAtURL:URL error:nil]
        || relationship == NSURLRelationshipOther) {
        return nil;
    }
    
    NSUInteger port = 8080;
    if (![ViewController httpServer].isRunning) {
        [[ViewController httpServer] addGETHandlerForBasePath:@"/" directoryPath:readAccessURL.path indexFilename:nil cacheAge:3600 allowRangeRequests:YES];
        [[ViewController httpServer] startWithPort:port bonjourName:nil];
    }
    
    NSString* target = [URL.path substringFromIndex:readAccessURL.path.length];
    NSURLComponents* components = [[NSURLComponents alloc] initWithString:@"http://127.0.0.1"];
    components.port = [NSNumber numberWithUnsignedInteger:port];
    components.path = target;
    return [NSURLRequest requestWithURL:components.URL];
}

+ (GCDWebServer*)httpServer
{
    static dispatch_once_t once;
    static GCDWebServer* server = nil;
    if (!server) {
        dispatch_once(&once, ^{
            server = [[GCDWebServer alloc] init];
        });
    }
    return server;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

@end
