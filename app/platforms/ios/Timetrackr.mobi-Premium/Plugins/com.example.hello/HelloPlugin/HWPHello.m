#import "HWPHello.h"

@implementation HWPHello

- (void)greet:(CDVInvokedUrlCommand*)command
{
	NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
	[formatter setLocale:[NSLocale currentLocale]];
	[formatter setDateStyle:NSDateFormatterNoStyle];
	[formatter setTimeStyle:NSDateFormatterShortStyle];
	NSString *dateString = [formatter stringFromDate:[NSDate date]];
	NSRange amRange = [dateString rangeOfString:[formatter AMSymbol]];
	NSRange pmRange = [dateString rangeOfString:[formatter PMSymbol]];
	BOOL is24h = (amRange.location == NSNotFound && pmRange.location == NSNotFound);

    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsBool:is24h];

    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

@end